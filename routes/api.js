const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const News = require ('../models/news');
const Special = require('../models/special');
const jwt = require('jsonwebtoken');
var fs = require('fs');

var domainName = "http://localhost:3000/";
const db = "mongodb://mario1:mario1@ds113713.mlab.com:13713/project";

mongoose.connect(db, function (err) {
  if (err) {
    console.error('Error! ' + err)
  } else {
    console.log('Connected to mongodb')
  }
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}


router.get('/events', (req, res) => {
  let events = [
    //za6to ne se promenq respons-a ne go li paraw na prawilnoto mqsto
    {
      "_id": "1",
      "name": "Baratheon",
      "imageUrl": '../../assets/banner/baratheon.jpg',
      "description": "Ours is the Fury",
      "city": "King's Landing",
      "tree": '../../assets/tree/baratheon-tree.jpg',
      "history": "House Baratheon was created when Orys Baratheon, one of Aegon I Targaryen's generals, his closest companion, and his rumored bastard half-brother, took Argella Durrandon, the only daughter of Argilac Durrandon, the last Storm King, to wife. Orys took the sigil and words of House Durrandon for his own and became the first Lord of Storm's End.Through the female line, House Baratheon descents from King Durran I 'Godsgrief', who founded the kingdom of the Storm Kings during the Age of Heroes.Ser Raymont Baratheon, a younger son of an unknown Lord Baratheon, was a member of the Kingsguard of King Aenys I Targaryen, and saved the life of his king during the Faith Militant uprising, when the Poor Fellows attempted to murder the king in his bed.During the Dance of the Dragons, Lord Borros Baratheon sided the House with Aegon II Targaryen and the greens, despite his late father, Lord Boremund's support of the blacks and relation to Rhaenys Targaryen (through his sister, Jocelyn Baratheon).Prince Aemond Targaryen was sent to Storm's End, to get Lord Borros to side with Aegon II, by offering a betrothal between himself and one of Lord Borros' four daughters. It is unknown whether this marriage occured prior to Aemond's death the next year. Lord Borros was reluctant to face the dragons during the war, but marched with his army towards the end of the war, seizing King's Landing for Aegon II during the Moon of the Three Kings, restoring the city to order. He was promised that his eldest daughter would marry King Aegon II, who had lost both his Queen, Helaena Targaryen, as well as both of his sons, during the war. Borros then marched against the approaching riverlander army, and fought in the Battle of the Kingsroad, where he was killed by young Lord Kermit Tully.",
      "videoUrl": "https://www.youtube.com/embed/u-pyxOoq_uM"
    },
    {
      "_id": "2",
      "name": "Stark",
      "imageUrl": '../../assets/banner/stark.jpg',
      "description": "Winter is coming",
      "city": "Winterfell",
      "tree": '../../assets/tree/stark-tree.png',
      "history": "The Starks are an ancient house of First Men descent. House Stark was founded by Brandon the Builder, a legendary figure who lived during the Age of Heroes. Bran the Builder is said to have raised Winterfell, the seat of the Starks, and the Wall, and other legends connect him with Storm's End and the Hightower. The Starks were Kings of Winter in the north for eight thousand years since the Age of Heroes, possibly beginning with Bran the Builder. The Night's King, the attainted thirteenth Lord Commander of the Night's Watch, has been suggested to have been a Stark, among other possibilities. The Night's King is said to have been defeated by Brandon the Breaker and Joramun. The ancient Starks gradually defeated rival kings, such as the Barrow Kings to their south and the Red Kings to their east. For several millennia, the Starks were not the uncontested Kings in the North.",
      "videoUrl": "https://www.youtube.com/embed/zmXXw2cyO-A"
    },
    {
      "_id": "3",
      "name": "Targaryen",
      "imageUrl": '../../assets/banner/targaryen.jpg',
      "description": "Fire and Blood",
      "city": "King's Landing",
      "tree": '../../assets/tree/targaryen-tree.jpg',
      "history": "House Targaryen was one of the forty ancient noble houses known as dragonlords who ruled the Valyrian Freehold, a great empire spanning much of Essos. The Targaryens were not one of the most powerful houses, however. The family resided in Valyria until Daenys Targaryen, also known as Daenys the Dreamer, the daughter of Lord Aenar Targaryen, had visions of a cataclysm that would come over Valyria. Aenar sold his estates in Valyria and moved his wives, children, other relatives, slaves, wealth, and five dragons (including Balerion) to Dragonstone, an island at the entrance of Blackwater Bay and the westernmost outpost of Valyrian influence, where he took possession of a castle of the same name, in 126 BC. Twelve years later the Doom descended on the city of Valyria, leading to the collapse of the Freehold. The Targaryens were the only dragonriders of Valyria to survive. In the century that followed, four of the five dragons of House Targaryen died, with only Balerion surviving. Two more dragons, Vhagar and Meraxes, were hatched from eggs on Dragonstone, however.During the century after the Doom, which became known as the Century of Blood due to the violent struggles for power in Essos, Volantis attempted to seize power over Valyria's colonies. Most of the other Free Cities rebelled against against Volantis, and towards the end of the Century of Blood, the young Lord Aegon Targaryen, rider of the dragon Balerion, was approached by Pentos and Tyrosh to form an alliance. Aegon, mounted on his dragon Balerion, flew first to Pentos to meet its prince, and then to Lys, where he set the Volantene fleet aflame. With Volantis's rule at an end, he returned to Dragonstone, and focussed his attention to the lands west, which had always been of interest to him",
      "videoUrl": "https://www.youtube.com/embed/uTy8rsLYJV8"
    },
    {
      "_id": "4",
      "name": "Lanister",
      "imageUrl": '../../assets/banner/lanister.jpg',
      "description": "A Lannister always pays his debts",
      "city": "Casterly Rock",
      "tree": '../../assets/tree/lanister-tree.jpg',
      "history": "House Lannister of Casterly Rock is one of the Great Houses of Seven Kingdoms, and the principal house of the westerlands. Their seat is Casterly Rock, though another branch exists that is based in nearby Lannisport. Their sigil is a golden lion on a field of crimson. Their official motto is 'Hear Me Roar!' However, their unofficial motto, equally well known, is 'A Lannister always pays his debts'. The Warden of the West is a Lannister by tradition. ",
      "videoUrl": "https://www.youtube.com/embed/9i083q2CqXI"

    },
    {
      "_id": "5",
      "name": "Martell",
      "imageUrl": '../../assets/banner/martell.jpg',
      "description": "Unbowed, Unbent, Unbroken",
      "city": "King's Landing",
      "tree": '../../assets/tree/martell-tree.jpg',
      "history": "House Nymeros Martell, usually simply called House Martell, is one of the Great Houses of the Seven Kingdoms and the ruling house of Dorne. 'Nymeros' indicates 'of the line of Nymeria,' referring to the union of the Martells with the Rhoynish warrior queen Nymeria around 700 BC. Prince of Dorne rules Dorne from Sunspear in southeastern Dorne.",
      "videoUrl": "https://www.youtube.com/embed/6VCGXAYYntc"
    },
    {
      "_id": "6",
      "name": "Greyjoy",
      "imageUrl": '../../assets/banner/greyjoy.jpg',
      "description": "What is Dead May Never Die",
      "city": "King's Landing",
      "tree": '../../assets/tree/greyjoy-tree.jpg',
      "history": "House Baratheon was created when Orys Baratheon, one of Aegon I Targaryen's generals, his closest companion, and his rumored bastard half-brother, took Argella Durrandon, the only daughter of Argilac Durrandon, the last Storm King, to wife. Orys took the sigil and words of House Durrandon for his own and became the first Lord of Storm's End.Through the female line, House Baratheon descents from King Durran I 'Godsgrief', who founded the kingdom of the Storm Kings during the Age of Heroes.Ser Raymont Baratheon, a younger son of an unknown Lord Baratheon, was a member of the Kingsguard of King Aenys I Targaryen, and saved the life of his king during the Faith Militant uprising, when the Poor Fellows attempted to murder the king in his bed.During the Dance of the Dragons, Lord Borros Baratheon sided the House with Aegon II Targaryen and the greens, despite his late father, Lord Boremund's support of the blacks and relation to Rhaenys Targaryen (through his sister, Jocelyn Baratheon).Prince Aemond Targaryen was sent to Storm's End, to get Lord Borros to side with Aegon II, by offering a betrothal between himself and one of Lord Borros' four daughters. It is unknown whether this marriage occured prior to Aemond's death the next year. Lord Borros was reluctant to face the dragons during the war, but marched with his army towards the end of the war, seizing King's Landing for Aegon II during the Moon of the Three Kings, restoring the city to order. He was promised that his eldest daughter would marry King Aegon II, who had lost both his Queen, Helaena Targaryen, as well as both of his sons, during the war. Borros then marched against the approaching riverlander army, and fought in the Battle of the Kingsroad, where he was killed by young Lord Kermit Tully.",
      "videoUrl": "https://www.youtube.com/embed/lPb0vSgH6Zs"

    },
    {
      "_id": "7",
      "name": "Arryn",
      "imageUrl": '../../assets/banner/arryn.jpg',
      "description": "As High as Honor",
      "city": "King's Landing",
      "tree": '../../assets/tree/arryn-tree.jpg',
      "history": "House Arryn of the Eyrie is one of the Great Houses of Westeros, and is the principal noble house in the Vale of Arryn. Their main seat is the Eyrie, which is considered impregnable. House Arryn has at least one other holding, their winter castle at the Gates of the Moon, which was once their main seat. Both of these fortifications sit astride the Giant's Lance, the tallest mountain in the Vale, the Gates of the Moon at its foot, the Eyrie at its top. The Arryn sigil is a sky-blue falcon soaring upwards, outlined against a white moon on a sky-blue field, and their words are 'As High as Honor'.",
      "videoUrl": "https://www.youtube.com/embed/D8vkXptU468"
    },
    {
      "_id": "8",
      "name": "Tyrell",
      "imageUrl": '../../assets/banner/tyrell.jpg',
      "description": "Growing Strong",
      "city": "King's Landing",
      "tree": '../../assets/tree/tyrell-tree.jpg',
      "history": "House Tyrell of Highgarden is one of the Great Houses of the Seven Kingdoms, being Lords Paramount of the Mander and the liege lords of the Reach. A large, wealthy house, its wealth is only surpassed among the Great Houses by House Lannister, and the Tyrells can field the greatest armies. Additionally, if they call the ships of the Redwyne fleet, the lords of the Shield Islands, and the coastal lords, they can command a navy that equals if not surpasses the royal fleet of King's Landing. ",
      "videoUrl": "https://www.youtube.com/embed/-BSAu7Px-lY"
    },
    {
      "_id": "9",
      "name": "Tully",
      "imageUrl": '../../assets/banner/tully.jpg',
      "description": "Family, Duty, Honor",
      "city": "King's Landing",
      "tree": '../../assets/tree/tully-tree.jpg',
      "history": "House Tully of Riverrun is one of the Great Houses of the Seven Kingdoms. Lord Hoster Tully, the Lord Paramount of the Trident, rules over the riverlands from the Tully seat of Riverrun. Their sigil is a silver trout leaping on a striped field of blue and mud red, and their house words are 'Family, Duty, Honor.'",
      "videoUrl": "https://www.youtube.com/embed/RcAKd_dwPIQ"
    }
  ]
  res.json(events)
})

router.get('/specia', verifyToken, (req, res) => {
  let specialEvents = [
    {
      "_id": "1",
      "name": "Ser Arthur Dayne",
      "description": "Ser Arthur Dayne, known as the Sword of the Morning, was a famed and legendary knight from House Dayne and a member of Aerys II Targaryen's Kingsguard. Many considered him to have been the most chivalrous warrior of the Seven Kingdoms. Arthur was Prince Rhaegar Targaryen's closest friend. He was the brother of Lady Ashara Dayne and Lady Allyria Dayne. His nephew, the son of Arthur's unknown older brother, is Lord Edric Dayne.",
      "theme": "'Sword of the Morning'",
      "imageUrl": "http://localhost:3000/special-events/arthur-dayne-1.png",
      "videoUrl": "https://www.youtube.com/embed/7UOryLeU86A",
      "date": "2018-10-14T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Hand of the king",
      "description": "The Hand of the King or Hand of the Queen, in cases of a ruling female monarch, or simply the King's Hand, is the most powerful appointed position in the Seven Kingdoms, second only to the King in authority and responsibility. The Hand is the King's closest advisor, appointed and authorized to make decisions on behalf of the King's name. The Hand of the King is the highest-ranking member of the Small Council, and leads meetings of the council as proxy for the king when the monarch is absent. Hands of the King are addressed as 'Lord Hand'.",
      "theme": "'Represented by Petyr Baelish'",
      "imageUrl": "http://localhost:3000/special-events/lord-hand-1.jpg",
      "videoUrl": "https://www.youtube.com/embed/jEFBC8lchLA",
      "date": "2018-09-11T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Valyrian Steel",
      "description": "Valyrian steel is a form of metal that was forged in the days of the mighty Valyrian Freehold. When fashioned into bladed weapons, the steel can hold an especially keen edge, remaining sharp forever without the need for honing.",
      "theme": "'Represented by Jorah Mormont'",
      "imageUrl": "http://localhost:3000/special-events/valyrian-steel-4.jpg",
      "videoUrl": "https://www.youtube.com/embed/HyBgag9gY14",
      "date": "2018-09-11T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "The north remembers!",
      "description": "'The North Remembers' is the first episode of the season seven of Game of Thrones. It is the eleventh episode of the series overall. It premiered on April 1, 2012. It was written by David Benioff & D.B. Weiss and directed by Alan Taylor.",
      "theme": "'Winter came for House Frey'",
      "imageUrl": "http://localhost:3000/special-events/north-remembers.jpg",
      "videoUrl": "https://www.youtube.com/embed/0miGSjYG0G4",
      "date": "2018-09-11T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Aerys II Targaryen",
      "description": "Aerys Targaryen the Second of His Name, also called the Mad King and King Scab, was the seventeenth and last member of the Targaryen dynasty to sit the Iron Throne, ruling from 262 AC to 283 AC. His children that lived to adulthood, by his sister-wife, Rhaella Targaryen, were Rhaegar, Viserys, and Daenerys.",
      "theme": "'Represented by Tywin Lannister'",
      "imageUrl": "http://localhost:3000/special-events/mad-king-3.jpg",
      "videoUrl": "https://www.youtube.com/embed/Tp_0lOyUCO8",
      "date": "2018-09-24T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Aegon Targaryen, Seventh of his Name",
      "description": "Aerys Targaryen the Second of His Name, also called the Mad King and King Scab, was the seventeenth and last member of the Targaryen dynasty to sit the Iron Throne, ruling from 262 AC to 283 AC. His children that lived to adulthood, by his sister-wife, Rhaella Targaryen, were Rhaegar, Viserys, and Daenerys.",
      "theme": "'...he's the heir to the Iron Throne.'",
      "imageUrl": "http://localhost:3000/special-events/jon-snow-1.jpg",
      "videoUrl": "https://www.youtube.com/embed/mXMYRwl7Imc",
      "date": "2018-09-24T18:25:43.511Z"
    }
  ]
  res.json(specialEvents)
})

router.get('/special',verifyToken, (req, res) => {
  Special.find({}, (err, special) => {
    if(err){
      console.log(err)
    } else {
      res.json(special)
    }
  })
})

router.get('/special/:id', (req,res) => {
  Special.findById(req.params.id, (err, special) => {
    if(err){
      console.log(err)
    } else {
      res.json(special)
    }
  })
})

router.post('/create-special-event', (req, res) =>{
  if (loggedUser !== 'admin@admin.com') {
    return;
  }
  //nqkakwi prowerki za body
  //News.create();
  let requestBody = req.body;
  let decodedImage = requestBody.image;
  var base64Data = decodedImage.replace(/^data:image\/jpeg;base64,/, "");

  let randomName = Math.random().toString(36).substring(7) + ".png";
  fs.writeFile("uploads/" + randomName, base64Data, 'base64',
   err => {
     if (err) {
      console.warn(err);
     }
    }
  );
  
  let special = new Special({
    name: requestBody.name,
    description: requestBody.description,
    theme: requestBody.theme,
    imageUrl: domainName + randomName,
    videoUrl:  requestBody.videoUrl,
    date: Date.now(),
  })
  special.save((err, special) => {
    if(err){
      console.warn(err);
    } else {
        res.status(200).send(special)
    }
  })
})

router.get('/news/:id', (req,res) => {
  News.findById(req.params.id, (err, news) => {
    if(err){
      console.log(err)
    } else {
      res.json(news)
    }
  })
})

router.get('/news', (req, res) => {
  News.find({}, (err, news) => {
    if(err){
      console.log(err)
    } else {
      res.json(news)
    }
  })
})

router.post('/create-news', (req, res) => {
  if (loggedUser !== 'admin@admin.com') {
    return;
  }
  //nqkakwi prowerki za body
  //News.create();
  let requestBody = req.body;
  let decodedImage = requestBody.image;
  var base64Data = decodedImage.replace(/^data:image\/jpeg;base64,/, "");

  let randomName = Math.random().toString(36).substring(7) + ".png";
  fs.writeFile("uploads/" + randomName, base64Data, 'base64',
   err => {
     if (err) {
      console.warn(err);
     }
    }
  );
  
  let news = new News({
    title: requestBody.title,
    description: requestBody.description,
    description1: requestBody.description1,
    imageUrl: domainName + randomName,
    videoUrl:  requestBody.videoUrl,
    author: requestBody.author,
    date: Date.now(),
  })
  news.save((err, news) => {
    if(err){
      console.warn(err);
    } else {
        res.status(200).send(news)
    }
  })
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      let payload = { subject: registeredUser._id }
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({ token })
    }
  })
})

let loggedUser = '';
router.post('/login', (req, res) => {
  let userData = req.body;
  loggedUser = req.body.email
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else
        if (user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ token })
        }
    }
  })
})

module.exports = router;