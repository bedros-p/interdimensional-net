# Backend

## Embeddings and magic

Go, TS+Hono or even Flask for the backend but I'll slap you if it's Flask\
Frontend vanilla\
Groq API must be used for the website frontend generation during runtime, but feel free to experiment with equally quick generation\
Embeddings are necessary

Use a dictionary and strip out words that can lead to inappropriate results

Website types can be forum, news, blog, recipe site, landing pages for fake products

Create a list of all combos once, then shuffle it - store in a file, and use this as the new wordlist for the seed\
Line the combo is in = seed (or index of combo basically)

Seed to be a randomly generated number and all pages to be browsable (I can visit /posts/fartenheimer and it would come up with something related even though the seed is about bedframe shopping) - how you store the seed is up to you, url params take the magic away though\
I'm thinking invis Unicode combinations could be used to create shareable seeded urls - sharing a seed is important 

Llm must be server side 

alternative to entirely generated frontend\
I think this is also pretty cool and can lead to more consistent branding for quick spreading of the software

Small bits of the frontend are generated, under templates - all can follow the same style with AI only adding in convincing text for the seed & slapping on user-generated content for that same seed