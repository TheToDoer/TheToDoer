**Base URL**
https://thetodoer-app.herokuapp.com

**Hvordan skape en ny liste**
POST /list/:navn -> end point som skaper en liste med navn :name og retunerer ny liste full struktur (link ny id).

**Hvordan få tak på en liste**
GET /list/:id -> end point som retunerer en liste basert på id

**Hvordan finne liste som tilhører bestemt deadline**
GET /list/:id/items/:deadline

**Hvordan sette filter på en liste**
PUT /list/:id/filter
