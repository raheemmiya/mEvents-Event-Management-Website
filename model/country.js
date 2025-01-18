class Country {
    constructor(countryName, eventName) {
        (this.countryName = countryName), (this.eventName = eventName);
    }

    static registerCountry() { }

    static selectCountry(countryName) { }

    static getCurrentCountry() { }

    static async getAllCountry() {
        const countryAPIresponse = await fetch( "https://api.first.org/data/v1/countries" );
        const responseData = await countryAPIresponse.json();
        const countries = Object.values(responseData.data).map((entry) => entry.country );
        return countries;
    }

    static getEventsByCountry(countryName) { }
}

module.exports = Country;
