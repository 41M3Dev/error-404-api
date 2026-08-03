const db = require("../config/db");

exports.getAllEvents = async (req,res) => {
    try {
        const events = await db("events")
            .where({ status: "published" })
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
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des événements."});
    }
};

exports.createEvent = async (req, res) => {
        try {
            const {
                title,
                description,
                place,
                price,
                max_participants,
                start_datetime,
                end_datetime,
                registration_deadline
            } = req.body;
            if (!title || !start_datetime) {
                return res.status(400).json({message: "Le titre et la date de début sont obligatoires."});
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
                registration_deadline: registration_deadline,
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
exports.updateEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await db("events").where({id: eventId}).first();
        if (!event) {
            return res.status(404).json({message: "Evénement introuvable."});
        }
        const allowedUpdate = {
            title: req.body.title,
            description: req.body.description,
            place: req.body.place,
            max_participants: req.body.max_participants,
            start_datetime: req.body.start_datetime,
            end_datetime: req.body.end_datetime,
            registration_deadline: req.body.registration_deadline,
            status: req.body.status
        };
        const dataToUpdate = {};
        Object.keys(allowedUpdate).forEach(key => {
            if (allowedUpdate[key] !== undefined) {
                dataToUpdate[key] = allowedUpdate[key];
            }
        });
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({message: "Aucune donnée valide fournie pour la mise à jour."});
        }
        await db("events").where({id: eventId}).update(dataToUpdate);
        return res.status(200).json({message: "L'événement a été mis à jour avec succès."});

    } catch (error) {
        console.error("Erreur lors de la mise a jour de l'événement :", error);
        return res.status(500).json({message: "Erreur interne lors de la mise à jour."});
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await db("events").where({ id: eventId }).first();
        if (!event) {
            return res.status(404).json({ message: "Evénement introuvable." });
        }
        await db("events").where({ id: eventId }).del();
        return res.status(200).json({ message: "L'événement a été définitivement surpprimé." });
        
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        return res.status(500).json({ message: "Erreur interne lors de la suppression." });
    }
}