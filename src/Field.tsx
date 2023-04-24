import { useState, useEffect } from "react";
import { Card } from "./Card";

function linearSpace(n_elements: number) {
  const numbers = Array(Math.floor(n_elements))
    .fill(0)
    .map((_, i) => i);
  return numbers;
}

function shuffle(array: number[]) {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

function getPairs(n_pairs: number, numbers: number[]) {
  let shuffeldNumbers = [...numbers];
  shuffeldNumbers = shuffle(shuffeldNumbers);
  let pairs: number[] = Array(numbers.length);

  for (let i = 0; i < n_pairs; i++) {
    const card1 = shuffeldNumbers[i];
    const card2 = shuffeldNumbers[i + n_pairs];
    pairs[card1] = card2;
    pairs[card2] = card1;
  }

  return pairs;
}

export function Field(props: { n_pairs: number }) {
  const n_cards = props.n_pairs * 2;
  const numbers = linearSpace(n_cards);
  //let pairs = useRef(getPairs(props.n_pairs, numbers));
  let [pairs, setPairs] = useState<number[]>(getPairs(4, numbers));

  const [cardFlipped, setCardFlipped] = useState<boolean[]>([false]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  function CardsMatch() {
    let first = selectedCards[0];
    let second = selectedCards[1];

    console.log("First Card: ", first);
    //console.log("First Match: ", pairs.current[first]);
    console.log("First Match: ", pairs[first]);

    //if (pairs.current[first] !== second) {
    if (pairs[first] !== second) {
      console.log("No match: Try again");
      let cardFlipped_copy = [...cardFlipped];
      cardFlipped_copy[first] = !cardFlipped_copy[first];
      cardFlipped_copy[second] = !cardFlipped_copy[second];
      setCardFlipped(cardFlipped_copy);
    } else {
      console.log("Found a match");
    }
    setSelectedCards([]);
    return;
  }

  function flipCard(index: number) {
    let cardFlipped_copy = [...cardFlipped];
    let selectedCards_copy = [...selectedCards];

    if (cardFlipped[index]) return;

    if (selectedCards_copy.length >= 2) {
      CardsMatch();
      return;
    }

    selectedCards_copy.push(index);
    setSelectedCards(selectedCards_copy);

    cardFlipped_copy[index] = !cardFlipped_copy[index];
    setCardFlipped(cardFlipped_copy);
  }

  const [cat, setCat] = useState<string[]>([""]);

  useEffect(
    function () {
      function fetchCats() {
        console.log("fetchCats");
        let catUrls: string[] = Array(n_cards);
        //pairs.current.forEach(async (value, index) => {
        pairs.forEach(async (value, index) => {
          const response = await window.fetch(
            "https://cataas.com/cat?t=sq&json=true"
          );
          const parsedResponse = await response.json();
          catUrls[index] = `https://cataas.com/${parsedResponse.url}`;
          catUrls[value] = `https://cataas.com/${parsedResponse.url}`;
        });
        setCat(catUrls);
      }

      fetchCats();
    },
    [pairs, n_cards]
  );

  const backsides = numbers.map((element) => (
    <img
      //src={`${cat[pairs.current[element]]}`}
      src={`${cat[pairs[element]]}`}
      alt={`Random Cat ${element}`}
      width="200px"
    />
  ));

  function resetGame() {
    setSelectedCards([]);
    setCardFlipped([]);
    //pairs.current = getPairs(props.n_pairs, numbers);
    setPairs(getPairs(props.n_pairs, numbers));
    return;
  }

  const cards = numbers.map((element, i) => {
    return (
      <Card
        label={backsides[i]}
        flipped={cardFlipped[i]}
        setFlipped={() => flipCard(i)}
        key={element}
      />
    );
  });

  if (
    cardFlipped.length === n_cards &&
    cardFlipped.every((element) => element)
  ) {
    let button = <button onClick={resetGame}>Play again?</button>;
    return (
      <div className="Field">
        {" "}
        {cards} {button}{" "}
      </div>
    );
  }

  return <div className="Field"> {cards} </div>;
}
