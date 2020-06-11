const express = require("express");
const admin = require("firebase-admin");
var serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test3-138e7.firebaseio.com",
});

const router = express.Router();
const endPoint = "/messages";

const db = admin.firestore();

// /messages のみの時
router
  .route(endPoint)
  .get(async (req, res) => {
    const messages = [];
    try {
      const querySnapshot = await db.collection("messages").get();
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    } catch (error) {
      console.error(error, "@@@@@@@@@");
    }
    res.json({
      message: "Called by the GET method",
      messages,
    });
  })
  .post(async (req, res) => {
    const { name, body } = req.body;
    const createdAt = new Date().toISOString();

    try {
      const docRef = await db.collection("messages").add({
        name,
        body,
        createdAt,
      });
      const docSnapshot = await docRef.get();
      const createdMessage = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      res.json({
        message: "Called by the POST method",
        data: createdMessage,
      });
    } catch (error) {}
  });

// /messages/1 など
router
  .route(`${endPoint}/:id`)
  .put( async (req, res) => {
    const id = req.params.id;
    // const { name, body } = req.body;
    const name = req.body.name;
    const body = req.body;

    const newData = {
      name,
      body,
    };

    try {
      await db
      .collection('messages')
      .doc(id)
      .update(newData);
      res.json({
        message: `Updated!! ID:${id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: `何かエラーが起きたよ ID:${id}`,
      });
    }
  })
  .delete( async (req, res) => {
    const id = req.params.id;
    try {
        await db
        .collection('messages')
        .doc(id)
        .delete();
        res.json({
          message: `deleted!! ID:${id}`,
        });
      } catch (error) {
        res.status(500).json({
          message: `何かエラーが起きたよ ID:${id}`,
        });
      }
  });

module.exports = router;
