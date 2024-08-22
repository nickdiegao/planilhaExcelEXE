const axios = require('axios');
const xlsx = require('xlsx');
const readlineSync = require('readline-sync');

// Função para buscar os dados da API
async function fetchCountryData() {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return [];
    }
}

// Função para processar e transformar os dados em um formato adequado e ordenar
function processCountryData(data) {
    const processedData = data.map(country => ({
        name: country.name.common,
        officialName: country.name.official,
        nativeName: country.name.nativeName ? Object.values(country.name.nativeName)[0].common : '',
        topLevelDomain: country.tld ? country.tld[0] : '',
        independent: country.independent || false,
        region: country.region,
        subregion: country.subregion,
        latitude: country.latlng[0],
        longitude: country.latlng[1],
        area: country.area,
        population: country.population,
        alpha2Code: country.cca2,
        alpha3Code: country.cca3,
        numericCode: country.ccn3 || '',
        demonym: country.demonyms ? country.demonyms.eng.m : '',
        languages: country.languages ? Object.values(country.languages).join(', ') : '',
        // religions: country.religions ? Object.values(country.religions).join(', ') : '',
        capital: country.capital ? country.capital[0] : '',
        timezones: country.timezones ? country.timezones.join(', ') : '',
        borders: country.borders ? country.borders.join(', ') : '',
        currencyName: country.currencies ? Object.values(country.currencies)[0].name : '',
        currencyCode: country.currencies ? Object.keys(country.currencies)[0] : '',
        currencySymbol: country.currencies ? Object.values(country.currencies)[0].symbol : '',
        callingCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        drivingSide: country.car.side,
        // flagUrl: country.flags.png,
    }));

    return processedData
}

// Função para criar a planilha Excel
function createExcelSheet(data) {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Countries');
    xlsx.writeFile(workbook, 'countries.xlsx');
}

// Fluxo principal
async function main() {
    const countryData = await fetchCountryData();
    const processedData = processCountryData(countryData);

    // Pede ao usuário a quantidade de países que deseja incluir na planilha
    const numCountries = readlineSync.questionInt('Quantos paises voce quer incluir na planilha? ');

    // Seleciona a quantidade desejada de países
    const selectedData = processedData.slice(0, numCountries);

    createExcelSheet(selectedData);
    console.log(`Planilha Excel criada com sucesso com ${numCountries} países!`);
}

main();
