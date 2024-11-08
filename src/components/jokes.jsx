import React, { useState, useEffect } from "react";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Jokes() {
  const URL = "https://v2.jokeapi.dev/joke/Any?safe-mode";
  const [joke, setJoke] = useState("");
  const [jokesList, setJokesList] = useState([]);
  const [likes, setLikes] = useState([]); // Change likes to an array

  // Fetch joke from the API
  const getJoke = async () => {
    try {
      const response = await axios.get(URL);
      console.log(response);
      const newJoke =
        response.data.joke ||
        `${response.data.setup} - ${response.data.delivery}`;
      setJoke(newJoke);
    } catch (error) {
      console.error("Error fetching joke:", error);
    }
  };

  // Fetch a joke on initial render
  useEffect(() => {
    getJoke();
  }, []);

  // Add joke to the list and clear current joke
  const handleClick = () => {
    if (joke) {
      setJokesList((prevJokes) => [...prevJokes, joke]);
      setLikes((prevLikes) => [...prevLikes, 0]); // Initialize likes for new joke
      setJoke("");
    }
    getJoke();
  };

  // Delete a joke from the list
  const handleDelete = (index) => {
    setJokesList((prevJokes) => prevJokes.filter((_, i) => i !== index));
    setLikes((prevLikes) => prevLikes.filter((_, i) => i !== index)); // Remove likes for deleted joke
  };

  // Handle like for each joke
  const handleLike = (index) => {
    setLikes((prevLikes) => {
      const newLikes = [...prevLikes]; // Create a copy of the previous likes array
      newLikes[index] += 1; // Increment like count at the specified index
      return newLikes; // Return the updated likes array
    });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-6 offset-3 text-center">
            <h1>Create Jokes</h1>
            <button className="btn btn-primary mb-3" onClick={handleClick}>
              Get Joke
            </button>
            <hr style={{ border: "2px solid #3498db" }} />
            <ul className="mt-3">
              {jokesList.length > 0 ? (
                jokesList.map((joke, index) => (
                  <li key={index} className="joke-item">
                    <p>{joke}</p>
                    <button
                      onClick={() => handleLike(index)}
                      className="btn btn-light btn-sm"
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      {likes[index] >= 0 && ` (${likes[index]})`} {/* Show like count */}
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>Loading joke...</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
