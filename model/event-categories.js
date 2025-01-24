const { getEventCategoriesDb } = require("../utility/eventCategoriesDb");

class EventCategory {
    static COLLECTION_NAME = 'event-categories';

    constructor(categoryName) {
        this.categoryName = categoryName;
        this.events = []; // Array to store event names and IDs
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async getCollection() {
        const db = getEventCategoriesDb();
        return db.collection(this.COLLECTION_NAME);
    }

    // Add event to existing category or create new category
    static async addEventToCategory(event) {
        try {
            const collection = await this.getCollection();
            const categoryName = event.category;
            
            // Try to find existing category
            const category = await collection.findOne({ categoryName });

            if (category) {
                // Add event to existing category
                return await collection.updateOne(
                    { categoryName },
                    { 
                        $push: { events: event },
                        $set: { updatedAt: new Date() }
                    }
                );
            } else {
                // Create new category with event
                const newCategory = new EventCategory(categoryName);
                newCategory.events.push(event);  // Push the entire event object
                return await collection.insertOne(newCategory);
            }
        } catch (error) {
            console.error("Error adding event to category:", error);
            throw error;
        }
    }

    // Get all events in a category
    static async getEventsByCategory(categoryName) {
        try {
            const collection = await this.getCollection();
            const category = await collection.findOne({ categoryName: categoryName });
            return category ? category.events : [];
        } catch (error) {
            console.error("Error getting events by category:", error);
            throw error;
        }
    }

    // Get all categories
    static async getAllCategories() {
        try {
            const collection = await this.getCollection();
            return await collection.find({}).toArray();
        } catch (error) {
            console.error("Error getting all categories:", error);
            throw error;
        }
    }

    static async getEventsByCategoryAndCountry(categoryName, country) {
        try {
            const collection = await this.getCollection();
            const category = await collection.findOne({ categoryName: categoryName });
            if (!category) return [];
            return category.events.filter(event => event.country === country);
        } catch (error) {
            console.error("Error getting events by category and country:", error);
            throw error;
        }
    }
}

module.exports = EventCategory;