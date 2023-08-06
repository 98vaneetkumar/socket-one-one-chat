const Messages = require("../models/messageModel");
const User=require("../models/userModel")
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
      sender:from,
    }).sort({ updatedAt: 1 });
    console.log("Message",messages); 
    const projectedMessages = messages.map((msg) => {
      console.log(" fromSelf: msg.sender.toString() === from,", msg.sender.toString() === from)
      //if this return false that's means message from other side if return true that's means
      //message from my side
      console.log("id",msg._id)
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        messageId:msg._id
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getlist = async (req, res, next) => {
  try {
    const { from} = req.body;

    // const distinctUsers = await Messages.find({
    //   sender: from
    // });
    // console.log("sender",req.body)
    const messages = await Messages.find({ sender: "649827c142e756221b75bb04" });
    const distinctUsers = [...new Set(messages.map(msg => msg.users.filter(user => user !== from)).flat())];
console.log("users",messages)
console.log("users1",distinctUsers)
    const userIDs = distinctUsers.filter(user => user !== from);

    const users = await User.find({ _id: { $in: userIDs } });

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};



module.exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.body.messageId; // Assuming the message ID is provided as a URL parameter

    // Delete the message with the specified ID
    const result = await Messages.deleteOne({ _id: messageId });

    if (result.deletedCount > 0) {
      return res.json({ msg: 'Message deleted successfully.' });
    } else {
      return res.json({ msg: 'Message not found.' });
    }
  } catch (ex) {
    next(ex);
  }
};


// const AWS = require('aws-sdk');

// module.exports.addMessage = async (req, res, next) => {
//   try {
//     const { from, to, message } = req.body;
//     var fileUrl;

//     if (req.message.fileUrl) {
//       // Upload file to AWS S3
//       const s3 = new AWS.S3({
//         accessKeyId: 'YOUR_ACCESS_KEY',
//         secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
//       });

//       const params = {
//         Bucket: 'YOUR_BUCKET_NAME',
//         Key: `${Date.now()}_${req.file.originalname}`,
//         Body: req.file.buffer,
//       };

//       const uploadedFile = await s3.upload(params).promise();
//       fileUrl = uploadedFile.Location;
//     }

//     const data = await Messages.create({
//       message: { text: message, fileUrl: fileUrl },
//       users: [from, to],
//       sender: from,
//     });

//     if (data) return res.json({ msg: "Message added successfully." });
//     else return res.json({ msg: "Failed to add message to the database" });
//   } catch (ex) {
//     next(ex);
//   }
// };
