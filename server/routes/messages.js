const { addMessage, getMessages ,deleteMessage,getlist} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getlist", getlist);
router.post("/getmsg/", getMessages);
router.delete("/delmsg/", deleteMessage);

module.exports = router;
