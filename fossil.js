var _ = require('underscore')
  , fs = require('fs')
  , util = require('./lib/util.js')
  , path = require('path')
  , fileParser = require('./lib/fileParser.js')
  , AdmZip = require('adm-zip')
  , wrench = require("wrench")
  , xmlbuilder = require("xmlbuilder")
  , config = require("./config.json");

var versionMC = config.packForgeVersion.split("-")[0]
  , versionForge = config.packForgeVersion.split("-")[1];

util.say("info", "Starting FOSSIL pack generation");
wrench.rmdirSyncRecursive("output", true);
fs.mkdirSync("output");
fs.mkdirSync("output/web");

util.say("info", "Creating config.zip");
var configZip = new AdmZip();
configZip.addLocalFolder("config", "config");
configZip.writeZip("output/web/config.zip");

util.say("info", "Creating XML file");
var xml = xmlbuilder.create("ServerPack");
xml.att("version", "3.1");
xml.att("xsi:schemaLocation", "http://www.mcupdater.com http://files.mcupdater.com/ServerPackv2.xsd");
var server = xml.ele("Server", {"id": config.packId, "name": config.packName,
	"newsUrl": config.packBaseURL + "changelog.html", "version": versionMC,
	"mainClass": "net.minecraft.launchwrapper.Launch", "revision": config.packRevision,
	"autoConnect": false});
server.ele("Import", {"url": "http://files.mcupdater.com/example/forge.php?mc="+versionMC+"&forge="+versionForge}, "forge");

util.say("info", "- scanning mods");
// Add commonside mods
var modsCommon = fileParser.getModList(["mods-common"]);
var modsClient = fileParser.getModList(["mods-client"]);
var modsServer = fileParser.getModList(["mods-server"]);
_.each(modsCommon, function(mod) { mod.side = "BOTH"; });
_.each(modsClient, function(mod) { mod.side = "CLIENT"; });
_.each(modsServer, function(mod) { mod.side = "SERVER"; });

// Sort the common list as it's the largest
modsCommon = modsCommon.sort(function(a,b) {
	if(a.name < b.name) return -1;
	if(a.name > b.name) return 1;
	return 0;
});

util.say("info", "- adding and copying mods");
_.each(_.union(modsCommon, modsClient, modsServer), function(mod) {
	util.say("info", "- - " + mod.filename);
	var name = mod.name + (_.has(mod, "version") ? (" " + mod.version) : "");
	var module = server.ele("Module", {"id": mod.id, "name": name, "side": mod.side});
	module.ele("URL", {"priority": 0}, config.packBaseURL + mod.filename);
	module.ele("Required", {"isDefault": true}, (mod.side == "BOTH"));
	module.ele("ModType", "Regular");
	module.ele("MD5", util.md5(mod.location));
	var meta = module.ele("Meta");
	if(_.has(mod, "authors")) {
		if(_.isString(mod.authors)) meta.ele("authors", {}, mod.authors);
		else meta.ele("authors", {}, mod.authors.join(", "));
	}
	if(_.has(mod, "description")) meta.ele("description", {}, mod.description);
	if(_.has(mod, "url")) meta.ele("url", {}, mod.url);
	if(_.has(mod, "version")) meta.ele("version", {}, mod.version);
	util.copyFileSync(mod.location, "output/web/" + mod.filename);
});
var configModule = server.ele("Module", {"id": "config", "name": "Configuration Files", "side": "BOTH"});
configModule.ele("URL", {"priority": 0}, config.packBaseURL + "config.zip");
configModule.ele("Required", {"isDefault": true}, true);
configModule.ele("ModType", "Extract");
configModule.ele("MD5", util.md5("output/web/config.zip"));

fs.writeFileSync("output/web/ServerPack.xml", server.end({"pretty": true, "indent": "    "}));
