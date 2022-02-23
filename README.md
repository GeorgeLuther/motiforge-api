# Motiforge

* Live version: https://motiforge-app.vercel.app
* Demo Username & Password: admin, pass
* Associated APP: https://github.com/GeorgeLuther/motiforge-app

Contents:\
\
[Application Summary](#application-summary)\
[Front-end Concepts](#front-end-concepts)\
[API Endpoints](#application-summary)

## Summary

Motiforge is a CRUD application created to assists users in the music composition process. 
Users can create music from some of its basic building blocks:

- Motifs
- Phrases
- Forms[]

 The long term goal of this project is to create an app that generates music through a system of rules, ranges, and randomness. Eventually users should be able to guide or control almost every aspect of the composition process or leave it completely up to the machine; always with interesting and appealing musical results. This version was based on a bottom-up approach to composition and the concept of concatenation. We build small motifs and variations thereof. Then, given a harmonic structure these motifs are concatenated into larger phrases and variations thereof. These phrases are similarly concatenated into sections with consideration of tonal centers. Finally, the sections are concatenated into the formal structure of the piece and it is then performed.

 ### Technology Used 

 Motiforge is a RESTful application built with Javascript, CSS, and HTML/JSX. The primary front-end libraries used were React.js and Tone.js. On the back-end Node.js, with Express and Knex were the primary libraries for server and database construction and integration. A few other small tools such as jwt, xss, helmet, morgan, and bcrypt were also used for purposes of security, etc.

### Installation

Installing this app locally follows the standard methods for a react app:

1. Clone github repo to your machine
2. Run command 'npm i' to install dependencies locally
3. Run command 'npm run dev' to start up server locally
4. Set API_ENDPOINT in ./src/config.js to http://localhost:3000/api
4. Run command 'npm start' to start up app locally


## Front-end Concepts 

### Motif Page

In the motif creator you can select a motif to work on from a list of your motifs. 

![ScreenShot-Select-Motif](https://raw.githubusercontent.com/GeorgeLuther/readme-images/main/select-motif.jpg)

Once selected you can play back your idea with the play button. It will play on repeat with a break between each play through until paused.

![ScreenShot-PlayButton](https://raw.githubusercontent.com/GeorgeLuther/readme-images/main/play-motif.jpg)

Work on ideas by hand using the 'Draw Mode'. In this area you can edit the pitch of each note by selecting a different color. You can also add and delete beats or delete the entire motif with the options at the bottom.

![ScreenShot-Draw-Mode](https://raw.githubusercontent.com/GeorgeLuther/readme-images/main/draw-motif.jpg)

An alternative approach to creating motifs is to select an option in the 'Generate Motif' area. You may add individual notes to a motif, generate a whole new motif, or generate a variation on the motif. 

![ScreenShot-Generate-Motif](https://raw.githubusercontent.com/GeorgeLuther/readme-images/main/generate-motif.jpg)

The Phrase and form pages work quite similarly. These techniques are part of a long term goal of the project to provide a framework for human guided computer generated music. The functions at play are described below.

## Notes, Motifs, Phrases, and Forms: 

- Notes are represented by scale-degree between -3 & 8 where 0 = C / Tonal-Center, -3 = G / Lower Dominant. This octave and a half range prevents absurd jumps and unnatural melodies.
- Motifs are an array of notes
- Phrases contain an array of motifs and an array of the motif's respective modal shifts. When performed, the motif is shifted in the scale based on the 0 based scale degree of the modal shift. So a motif of notes, 0, 1, 2, 3 (a,b,c,d) with a modal_shift of 2 would become 2,3,4,5 (c,d,e,f).
- Forms contain an array of phrases and an array of the phrase's respective transpositions. When performed the phrase is moved as a whole chromatically given the transposition. motifs [0,1,2] [3,4,5] modally shifted to [1,2,3] [4,5,6] becomes midi notes [62,64,65] [67,69,71] and can be transposed by 1 to [63,65,66] [68,70,72]
- The scale degrees and transposition is relative to midi notes and a c major scale. So when we get to midi we are skipping some chromatic tones to create a major scale.

### Generate Notes: 
 These functions are used to generate individual notes given the context of the previous note. These functions are described further in as they relate to the makeMotif method (step 2). 

### Generate Motifs: 
These functions are used to generate an array of pitches 

#### makeMotif: 
[x]
Small 2 to 5 note ideas that emphasize chord-tones
1. The first note is either a random note within the octave or a chord-tone
2. The notes in-between can be
- randNote: A random note within the octave
- chordNote: A chord-tone
- nearNote: The nearest chord-tone to the previous note
- stepNote: A note up or down 1 step i.e. 1>>2 or 1>>-1
- skipNote: A note up or down an interval of a third i.e 1>>3 or 1>>-2
- hopNote: A note up a fourth or down a fifth
- jumpNote: A note up a fifth or down a fourth
3. If the first note was a chord tone then the last note can be any of the above.
If the first note was not a chord tone then the last note must be the nearest chord-tone to the second to last note

#### linearMotif: 
[x]
Make a motif moving in one direction by a fixed intervallic leap.
i.e 1,2,3,4,5 or 1,3,5,7,9 or 1,4,7,10
If the interval is large then the motif will be shorter, this is done to avoid melodies that span an 'unnatural' range.

#### circleMotif: 
[]
A circle motif approaches or trails a chord tone with a pattern of symmetrically related notes.
i.e 243 or 3423 or 4,2,-3,-1,1

### Manipulate Motifs:
These functions create variations based on a motif

#### Reverse: 
[x]
flips a motif from end to start
0,2,4 becomes 4,2,0

#### Mirror: 
[x]
the original motif followed by its reverse, including or excluding its apex
1,2,3,4,4,3,2,1 or 1,2,3,4,3,2,1

#### Negate: 
[x]
each note becomes its negative (relative to scale/tonal center)
2,3,4 becomes -2,-3,-4

#### Invert: 
[x]
each note becomes its negative relative to the starting pitch
2, 3 ,4 becomes 2,1,-1

#### Upend:
[x]
each note becomes its negative relative to the end pitch

#### Overturn:
[x]
each note becomes its negative relative to the midpoint of the pitch range used
...TODO: method/argument to use mean, median, mode, or midpoint of range?

#### Shuffle: 
[x]
randomly redistributes some or all of the notes in a motif
1, 2, 3, 4 becomes 2, 4, 3, 1
select all, random, or specific # of indexes

#### Trunk: 
[x]
takes (a) section(s) out of the motif
1, 2, 3, 4, 5, becomes 1, 2, 5

#### Hunk: 
[]
takes (a) section(s) of the motif and moves them around
1, 2, 3, 4, 5 becomes 1, 2, 5, 3, 4

#### Thunk: 
[]
takes (a) section(s) of the motif and copies them into a new spot

#### Weave:
[]
takes a sequence from the motif and distributes it evenly within the motif, delace / interlace

#### Shift:
[]
shift the motif up or down relative to emphasized chord-tones

#### Noise:
[X]
randomly replaces some non-chord tones
1, 2, 3, 4, 5, 6 become 1, 7, 3, 4, 5, 2

#### Similar?: 
[]
When note, motif, and phrase are encapsulated, this will use the same technique as was used originally but with a minor difference
1,3,2,4,3,5,4 might become 1,4,2,5,3,6,4 
1, 2, 1, 3, 1, 4 might become 1, 3, 1, 5, 1, 7 or 1, 4, 1, 3, 1, 2

#### Combine?:
Methods should be created that combine multiple motifs in various ways such as interlacing.

## Phrase Page

In the phrase creator you can select a phrase to work on from a list of your phrases. This page works much the same way as the motif page, but instead of notes you are manipulation motifs. We can produce familiarity and order by putting motifs into patterns. A phrase is a larger melodic idea made from multiple motifs.
The phrase creator will assist you in building phrases from repeated motifs and variations thereof. You can make things more interesting by with harmony. Modal harmony is made possible here by shifting the pitch of motifs so they fit with certain notes. This progression of pitch contexts creates a sense of tension and release. 

### Generate Phrases: 
 These functions will be used to generate arrays of phrases.


#### makePhrase: 
[] Creates a pattern of motifs and applies a harmonic progression.
1. Determines the motifs and variations that will be used.
2. Create a chord progression proportionate to the motific complexity of the phrase. (Currently 1 chord per motif. In future versions more consideration should be given to what is implied by the motif.)
3. Shift motifs via chord progression and concatenate into phrase.
4. Add phrase to phrases array.

#### imitatePhrase:
[] Creates a pattern of motifs that follows the same structure of repetition and variation as another phrase but uses a different set of motifs

#### Manipulate Phrases:
 These functions allows for variations of phrases. These ideas are being brainstormed. They will likely be similar if not combined with the motif manipulations.

#### Reverse: flips a phrase from end to start
1,2,3,4,5 becomes 5,4,3,2,1

#### Mirror: the original phrase followed by its reverse, including or excluding its apex
1,2,3,4,4,3,2,1 or 1,2,3,4,3,2,1

#### Shuffle: randomly redistributes motifs in the phrase
1,2,3,4,5 becomes 1,4,2,3,5

#### Rondo: a phrase keeps repeating periodically and may bookend the phrase
I.e 1,2,3,4,5,6,7,8 becomes 1,2,3,1,4,5,1,6,7,1,8
2,3,4,5,6 becomes 1,2,1,3,1,4,1,5,1,6,1

#### Braid: distributes a part of the existing phrase into itself 
create motif sequence from the existing phrase
random order
start from beginning, linear
start from end, linear
grab a chunk

#### Shuffle: distribute this sequence of motifs into the existing phrase
distribute evenly
distribute randomly (not recommended)
start from beginning, linear
start from end, linear
chunks


### Generate Modal Shifts:

Modal shifts will be determined based on the circle of fifths and markov chains developed from common chord progressions. Many of the concepts above may also apply.


## Form Page

The form page currently shows a few sketches of generative composition algorithms and a brief explanation of the concept.
Forms are created here through a system of rules, ranges, and randomness. This particular version attempts to apply a bottom-up approach to composition. We build small motifs and variations thereof. Then, given a harmonic structure these motifs are concatenated into larger phrases and variations thereof. These phrases are similarly concatenated into sections with consideration of tonal centers. Finally, the sections are concatenated into the formal structure of the piece and it is then performed.


## API

### Authorization

All API requests to protected endpoints will require the use of a bearer token. Generate a new one by submitting a successful POST request to the /api/login endpoint with a valid username and password.

To authenticate an API request, provide your bearer token in the `Authorization` header.

### Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, the application will respond with a JSON response in the following format:

```javascript
{
  "error" : {"message": string}
}
```

Contents:\
\
[Users Endpoints](#user-endpoints)\
[Auth Endpoints](#auth-endpoints)\
[Motif Endpoints](#motif-endpoints)\
[Phrase Endpoints](#phrase-endpoints)\
[Form Endpoints](#form-endpoints)

---


#### User endpoints


```http
POST /api/user
```
Create a new user

| Body Key   | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `username` | `string` | **Required**. User provided username  |
| `password` | `string` | **Required**. User provided password  |
| `name`     | `string` | **Required**. User provided name      |

<br />
<br />



#### Auth endpoints

```http
POST /api/auth/login
```

| Body Key   | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. User username |
| `password` | `string` | **Required**. User password |

<br />
<br />

### Protected Endpoints

The endpoints below require user to be logged in with JWT token in window storage.

#### Motif Endpoints

```http
GET /api/motif
```

Returns a JSON object containing all motifs with user_id matching user in database

<br />
<br />

```http
POST /api/motif
```

Generates a new blank motif with the user_id in the database. Returns a 201 and JSON object containing the new blank motif.

motif is given this info automatically

  name: 'Untitled',
  notes: '{0,0}',
  user_id: user_id

<br />
<br />


```http
GET /api/motif/:id
```

Returns a JSON object containing the motif with the matching id in database if user_id matches user

<br />
<br />


```http
DELETE /api/motif/:id
```

Deletes the motif with the given id from the database, given appropriate credentials. Returns a 204.

<br />
<br />


```http
PATCH /api/motif/:id
```

Edit information in motif, given id and credentials.

| Body Key   | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `name`  | `string` | User desired motif name, xss cleaned |
| `notes` | `array`  | User desired replacement array       |

<br />
<br />

#### Phrase Endpoints

```http
GET /api/phrase
```

Returns a JSON object containing all phrases with user_id matching user in database

<br />
<br />

```http
POST /api/phrase
```

Generates a new blank phrase with the user_id in the database. Returns a 201 and JSON object containing the new blank phrase.

phrase is given this info automatically

    name: 'Untitled',
    motifs: '{1,1}',
    modal_shifts: '{0,0}',
    user_id: user_id

<br />
<br />


```http
GET /api/phrase/:id
```

Returns a JSON object containing the phrase with the matching id in database if user_id matches user

<br />
<br />


```http
DELETE /api/phrase/:id
```

Deletes the phrase with the given id from the database, given appropriate credentials. Returns a 204.

<br />
<br />


```http
PATCH /api/phrase/:id
```

Edit information in phrase, given id and credentials.

| Body Key   | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `name`         | `string` | User desired motif name, xss cleaned |
| `motifs`       | `array`  | User desired replacement array       |
| `modal_shifts` | `array`  | User desired replacement array       |

<br />
<br />

#### Form Endpoints

```http
GET /api/form
```

Returns a JSON object containing all forms with user_id matching user in database

<br />
<br />

```http
POST /api/form
```

Generates a new blank form with the user_id in the database. Returns a 201 and JSON object containing the new blank form.

form is given this info automatically

    name: 'Untitled',
    phrases: '{1,1}',
    transpositions: '{0,0}',
    user_id: user_id

<br />
<br />


```http
GET /api/form/:id
```

Returns a JSON object containing the form with the matching id in database if user_id matches user

<br />
<br />


```http
DELETE /api/form/:id
```

Deletes the form with the given id from the database, given appropriate credentials. Returns a 204.

<br />
<br />


```http
PATCH /api/form/:id
```

Edit information in phrase, given id and credentials.

| Body Key   | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `name`         | `string` | User desired motif name, xss cleaned |
| `phrases`       | `array`  | User desired replacement array       |
| `transpositions` | `array`  | User desired replacement array       |

<br />
<br />

### Status Codes

This API returns the following status codes:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

---

#### Contact Developer

For questions/feedback or to discuss employment/project opportunities, contact the creator via email at george.e.luther@gmail.com
