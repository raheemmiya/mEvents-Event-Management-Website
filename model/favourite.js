const { getFavouritesDb } = require("../utility/favouritesDb");

class Favourite {
  constructor(userId, eventId) {
    this.userId = userId;
    this.eventId = eventId;
    this.createdAt = new Date();
  }

  async addFavourite() {
    const _db = await getFavouritesDb();
    try {
      const existingFav = await _db
        .collection("favourites")
        .findOne({ userId: this.userId, eventId: this.eventId });
      if (existingFav) {
        console.log("fav already exists");
        return;
      }
      await _db.collection("favourites").insertOne(this);
    } catch (error) {
      console.log("Error while adding to Favouorites");
    }
  }

  static async getAllFavouritesByUserId(userId) {
    const _db = await getFavouritesDb();
    try {
      const favouritesList = await _db
        .collection("favourites")
        .find({ userId: userId })
        .toArray();
      return favouritesList;
    } catch (error) {
      console.log("Error while adding to Favouorites");
    }
  }
}

module.exports = Favourite;
