const fs = require("fs");

const conf = {};
let langModels = [];

function parseLang(file) {
    lang = JSON.parse(fs.readFileSync(conf.langDir + '/' + file + '.json'));
    return lang
};

function config (val){
    conf.languages = typeof val.languages === 'object' ? val.languages : ['en'];
    conf.defaultLang = typeof val.defaultLang === 'string' ? val.defaultLang : 'en';
    conf.langDir = typeof val.langDir === 'string' ? val.langDir : 'languages';
    conf.cookieName = typeof val.cookieName === 'string' ? val.cookieName : 'lang';
    
    conf.languages.forEach((file) => {
        let model = parseLang(file);
        langModels.push({id: model._cfg.lang, model});
    });

};

function getModel(lang){
    const foundModel = langModels.find(item => item.id === lang);
    return foundModel ? foundModel.model : getModel(conf.defaultLang);
}

module.exports = {
    config,
    getModel
}