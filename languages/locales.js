const fs = require("fs");
const path = require('path');

const conf = {};
let langModels = [];

function parseLang(file) {
    lang = JSON.parse(fs.readFileSync(conf.langDir + '/' + file + '.json'));
    return lang
};

function config (val){
    conf.languages = typeof val.languages === 'object' ? val.languages : ['en'];
    conf.defaultLang = typeof val.defaultLang === 'string' ? val.defaultLang : 'en';
    conf.langDir = typeof val.langDir === 'string' ? val.langDir : path.resolve(__dirname);
    conf.cookieName = typeof val.cookieName === 'string' ? val.cookieName : 'lang';
    
    conf.languages.forEach((file) => {
        let model = parseLang(file);
        langModels.push({id: model._cfg.lang, model});
    });

    langModels.forEach((langModel) => {
        langModel.model._cfg.all = mergeModelsConfig(langModel.id);
    });

};

function getModel(lang){
    const foundModel = langModels.find(item => item.id === lang);
    const selectedModel = foundModel ? foundModel.model : getModel(conf.defaultLang);
    return selectedModel;
}

function mergeModelsConfig(selectedLang){
    // Collection to store { lang: lang_verbose } pairs
    const langCollection = [];
    
    // Iterate through models and build the collection
    langModels.forEach(model => {
        const lang = model.model._cfg?.lang;
        const langVerbose = model.model._cfg?.lang_verbose;

        if (lang && langVerbose) {
            langCollection.push({ [lang]: langVerbose });
        }
    });
    const selectedIndex = langCollection.findIndex(entry => Object.keys(entry)[0] === selectedLang);

    // Move the item to the top (if found)
    if (selectedIndex !== -1) {
        const selectedEntry = langCollection.splice(selectedIndex, 1)[0];
        langCollection.unshift(selectedEntry);
    }
    return langCollection;
}

module.exports = {
    config,
    getModel
}