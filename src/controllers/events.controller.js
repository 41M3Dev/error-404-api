const db = require("../config/db");

exports.getAllEvents = async (req,res) => {
    try {
        const events = await db("events")
            .select(
                "id",
                "title",
                "description",
                "start_datetime",
                "place",
                "price",
                "status"
            )
            .orderBy("start_datetime", "asc");
        
        return res.status(200).json(events);
    }catch (error) {
        console.error("Erreur lors de la récupératiomn des événements :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des événements."});
    }
};

exports.createEvent = async (req, res) => {
        try {
            const {title, description, place, price, max_participants, start_datetime, end_datetime} = req.body;
            if (!title || !start_datetime) {
                return res.status(400).json({message: "Le tire et la date de début sont obligatoires."});
            }
            const creatorId = req.user.id;
            const [newEventId] = await db("events").insert({
                title: title,
                description: description || null,
                place: place || null,
                price: price || 0.00,
                max_participants: max_participants || null,
                start_datetime: start_datetime,
                end_datetime: end_datetime,
                created_by: creatorId,
                status: "draft"
            });

            return res.status(201).json({
                message: "L'événement a été créé avec succès et mis en brouillon.",
                eventId: newEventId
            });
        } catch (error) {
            console.error("Erreur lors de la création de l'événement :", error);
            return res.status(500).json({ message: "Erreur interne lors de la création de l'événement." });
        }
};