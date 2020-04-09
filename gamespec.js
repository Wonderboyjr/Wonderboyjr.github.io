var gameJson =
{
  "title" :"<img src=\"ghost_theater.png\" width=\"150px\"><br>The ghostly case of the Spirit Theater",
  "intro": {
    "text": "You are a spectral investigator - a self-employed detective specializing in the paranormal. It is a normal day for you - ignore the alarm clock for an hour, drink a pot of coffee, check your empty day planner.\nThen just as you are about to settle in to scanning TikTok (for possible work leads of course) the phone rings... on the other end of the line is an agitated male, age approximately 50, guessing from his way of speaking as having a somewhat theatrical flare.<br><img src=\"romeo.png\" width=\"50px\">\nHe fills you in on his situation. He is the owner of a small theater which has fallen on hard times, {redText}{italic}mainly due to the fact that most of his cast were non-professional enough to get themselves killed by a spate of fatal accidents around the theater.{}{} The ones that survived decided to go and find a less-dangerous field of work.\nHe has decided to sell the theater but whenever potential buyers come to look at the place they are all scared away by what they claim are ghostly appartions. He would like you to come and basically get rid of them so he can {italic}\"sell the damn place\".{}",
    "effect" : "fadeIn2",
    "options": {
      "start":"This sounds interesting, plus I'm broke, so I'll take the case",
      "exit":"Ooh, too scary. I think I'll just get back to watching cat videos"
    },
  },
  "menu" : {
    "Backpack" : "showBackpack",
    "Map" : "showMap",
    "Characters" : "showCharacters",
    "Help!" : "showHelp",
  },
  "startRoom": "atrium",
  "rooms" : [
    {
      "name": "atrium",
      "description": "a dark and echo-ey atrium",
      "comment": "I feel saddened by it's distant splendour.",
      "coords": "5,1-5,1",
      "color":"#0a0"
    },
    {
      "name": "hall",
      "description": "a dark and dusty hallway",
      "comment": "Is that blood on the floor?",
      "coords": "5,2-5,3",
      "color":"red"
    },
    {
      "name": "basement",
      "description": "a damp-smelling basement",
      "coords": "1,1-3,1:1,2-4,2",
      "color":"blue"

    },
    {
      "name": "stage",
      "description": "a dark stage",
      "coords": "3,6-7,6",
      "color":"green"

    },
    {
      "name": "auditorium",
      "description": "a cobweb-filled auditorium",
      "coords": "3,4-7,5",
      "color":"brown"

    },
    {
      "name": "balcony",
      "description": "a lofty balcony",
      "comment": "From here I can see the whole theater",
      "coords": "3,3-4,3:5,3-7,3",
      "color":"yellow"
    },
    {
      "name": "backstage",
      "description": "a backstage",
      "comment": "The floor is cluttered with fallen curtains and broken scenery from long-dead shows",
      "coords": "2,6-2,6:2,7-8,7:8,6-8,6",
      "color":"yellow"
    },
    {
      "name": "green-room",
      "description": "a green room",
      "comment": "Costumes and spilled makeup are strewn everywhere.",
      "coords": "8,4-8,5",
      "color":"#808"
    },
    {
      "name": "star-room",
      "description": "a star's changing room",
      "comment": "Pieces of a broken chair lie about. A cracked mirror hangs on the wall.",
      "coords": "9,6-9,6",
      "color":"#880"
    }
  ],
  "doors": [
    {
      "between": "atrium,hall",
      "type": "stairs",
      "direction": "up",
    },
    {
      "between": "hall,basement",
      "opensWith": "hallBasementKey",
    },
    {
      "between": "hall,auditorium",
      "opensWith": "<text>knock knock",
      "comment": " ...letters are carved into it... \"Tell me a joke...\""
    },
    {
      "between": "auditorium,stage",
      "type": "stairs",
      "direction": "up",
    },
    {
      "between": "stage,backstage",
    },
    {
      "between": "backstage,star-room",
      "opensWith": "star-roomKey",
    },
    {
      "between": "backstage,green-room",
      "opensWith": "greenroomKey"
    },
  ],
  "objects": [
    {
      "name": "hallBasementKey",
      "description" : "a big brass key",
      "location" : "atrium",
      "weight": "1",
      "linkedProperties": "visible=flashlight/on",
      "visible": "false",
      "actions": [
        {
          "name" : "useOnDoors",
          "desc":"try it on the doors",
        }
      ]
    },
    {
      "name": "flashlight",
      "description" : "an old flashlight",
      "location" : "atrium",
      "weight": "1",
      "properties" : "on/false",
      "actions": [
        {
          "name" : "turn on",
          "desc":"turn on the flashlight",
          "result":"text/A weak shaft of light pierces the gloom",
          "when":"on/false",
          "property":"on/true",
        },
        {
          "name" : "turn off",
          "desc":"turn off the flashlight",
          "result":"text/The gloom returns",
          "when":"on/true",
          "property":"on/false",
        },
      ]
    },
    {
      "name": "cat",
      "description" : "a sleek cat who eyes me from a distance, twitching it's tail",
      "location" : "atrium",
      "actions": [
        {
          "name" : "crouch",
          "desc":"crouch down and give it your best 'here kitty kitty'",
          "result":"text/The cat casts a disdainful look in your direction and turns away",
        }, {
          "name":"ignore",
          "desc":"ignore it with admirable self-control",
          "result":"char/Stage Manager/hello",
        }
      ],
      "weight": "0",
      "activateWith":"light",
      "active":"false",
    }
  ],
  "characters" : [
    {
      "name": "Stage Manager",
      "backstory" : "My name is Betsy Pringle. I was the stage manager for this theater",
      "scripts" : [
        {
          "name":"hello",
          "text": "Hmmmrrrrr. Hmmmmeowww!<br><br>The cat nuzzles my leg.....<br><br>\"Helloooo. Who are you?\" - I hear those words in my head, but I swear the cat did not say them. I kneel down and look into it's green and somehow thoughtful eyes.",
          "actions" : [
            {
              "name" : "ignore",
              "desc":"No, you shake your head... you must be imagining it.",
              "result":"text/The cat gives you a puzzled look and turns away",
            },
            {
              "name" : "thoughts",
              "desc":"You crouch down and say softly \"What's up little fella\"",
              "result":"char/Stage Manager/part1",
            }
          ]
        },
        {
          "name":"part1",
          "text": "Hmmmrrrrr. Hmmmmeowww!<br><br>The cat looks me in the eye.....<br><br>I seem to hear, somewhere in my head... \"I need to tell you something... important\"...",
          "actions" : [
            {
              "name" : "thoughts",
              "desc":"You take a deep breath. \"OK, let's hear it\" you say, as if in a dream.",
              "result":"char/Stage Manager/part2",
            },
            {
              "name" : "ignore",
              "desc":"No, grrr... you REALLY must be imagining it.",
              "result":"text/The cat gives you a puzzled look and turns away",
            },
          ]
        },
        {
          "name":"part2",
          "text": "My name is Kat - I used to be the stage manager here, many years ago.",
          "actions" : [
          ]
        }
      ]
    }
  ]
}
