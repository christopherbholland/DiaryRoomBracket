
# **GraphQL API Documentation**

## **Overview**
The GraphQL API provides endpoints to manage podcast tournament brackets, episodes, hosts, and matchups. It supports queries and mutations for data retrieval and updates.

---

## **Getting Started**
### **Endpoint**
- Base URL: `http://yourdomain.com/graphql`

### **Authentication**
- **Optional**: No authentication required for this version.
- **Future Enhancements**: JWT token-based authentication.

### **Headers**
```json
{
  "Content-Type": "application/json"
}
```

### **Testing**
- Use [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/) or [Postman](https://www.postman.com/) for query/mutation testing.

---

## **Queries**
### 1. **`allHouseguests`**
Retrieve a list of all houseguests.
#### Query:
```graphql
query {
  allHouseguests {
    id
    name
    votes
    matchHistory {
      wins
      losses
      totalVotes
    }
  }
}
```
#### Response:
```json
{
  "data": {
    "allHouseguests": [
      {
        "id": "123abc",
        "name": "John Doe",
        "votes": 42,
        "matchHistory": {
          "wins": 3,
          "losses": 2,
          "totalVotes": 42
        }
      }
    ]
  }
}
```

---

### 2. **`allMatchups`**
Fetch all matchups with their details.
#### Query:
```graphql
query {
  allMatchups {
    id
    episodeId
    contestant1 {
      hostId
      votes
    }
    contestant2 {
      hostId
      votes
    }
    winner
  }
}
```
#### Response:
```json
{
  "data": {
    "allMatchups": [
      {
        "id": "matchup1",
        "episodeId": "episode1",
        "contestant1": {
          "hostId": "host1",
          "votes": 20
        },
        "contestant2": {
          "hostId": "host2",
          "votes": 25
        },
        "winner": "host2"
      }
    ]
  }
}
```

---

### 3. **`allEpisodes`**
Get all episodes with their details.
#### Query:
```graphql
query {
  allEpisodes {
    id
    title
    date
    hosts {
      id
      name
    }
    matchups {
      id
      winner
    }
  }
}
```
#### Response:
```json
{
  "data": {
    "allEpisodes": [
      {
        "id": "episode1",
        "title": "Pilot Episode",
        "date": "2024-01-01",
        "hosts": [
          {
            "id": "host1",
            "name": "John Doe"
          }
        ],
        "matchups": [
          {
            "id": "matchup1",
            "winner": "host2"
          }
        ]
      }
    ]
  }
}
```

---

## **Mutations**
### 1. **`createEpisode`**
Add a new episode to the database.
#### Mutation:
```graphql
mutation {
  createEpisode(input: {
    title: "New Episode"
    date: "2024-01-01"
    hosts: ["host1", "host2"]
    matchups: [
      {
        contestant1: { hostId: "host1", votes: 0 }
        contestant2: { hostId: "host2", votes: 0 }
        winner: null
      }
    ]
  }) {
    id
    title
  }
}
```
#### Response:
```json
{
  "data": {
    "createEpisode": {
      "id": "episode2",
      "title": "New Episode"
    }
  }
}
```

---

### 2. **`createMatchup`**
Add a new matchup to an episode.
#### Mutation:
```graphql
mutation {
  createMatchup(input: {
    episodeId: "episode1"
    contestant1: { hostId: "host1", votes: 0 }
    contestant2: { hostId: "host2", votes: 0 }
    winner: null
  }) {
    id
    episodeId
  }
}
```
#### Response:
```json
{
  "data": {
    "createMatchup": {
      "id": "matchup2",
      "episodeId": "episode1"
    }
  }
}
```

---

### 3. **`castVote`**
Vote for a houseguest in a matchup.
#### Mutation:
```graphql
mutation {
  castVote(input: {
    matchupId: "matchup1"
    contestantId: "host1"
  }) {
    id
    contestant1 {
      votes
    }
    contestant2 {
      votes
    }
  }
}
```
#### Response:
```json
{
  "data": {
    "castVote": {
      "id": "matchup1",
      "contestant1": {
        "votes": 21
      },
      "contestant2": {
        "votes": 25
      }
    }
  }
}
```

---

## **Error Handling**
- All mutations validate inputs:
  - Invalid or missing IDs return descriptive error messages.
  - Example:
    ```json
    {
      "errors": [
        {
          "message": "Matchup ID not found",
          "locations": [{ "line": 2, "column": 3 }],
          "path": ["castVote"]
        }
      ]
    }
    ```
- Queries return empty arrays if no data is found.

---

## **Future Additions**
1. **Update and Delete Mutations**
   - Example: Update episode title or delete a matchup.
2. **Bracket Progression**
   - Automation for advancing houseguests in tournaments.
3. **Authentication**
   - API key or JWT-based access.

---
