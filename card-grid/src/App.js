import React, { useState } from "react";
import "./App.css";

function downloadListAsTextFile(list, fileName) {
    // Convert the list to a string
    const text = list.join('\n');

    // Create a Blob object with the text and set the MIME type to "text/plain"
    const blob = new Blob([text], { type: "text/plain" });

    // Create a link element and set its attributes
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link element to the document body
    document.body.appendChild(link);

    // Click the link element to trigger the download
    link.click();

    // Remove the link element from the document body
    document.body.removeChild(link);
}



function App() {
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({
        description: "",
    });

    const handleFileUpload = (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                let cardIndex = cards.length > 0 ? Math.max(...cards.map((card) => card.id)) + 1 : 1
                const text = e.target.result;
                const lines = text.split('\n');
                const filelst = lines.map(line => {
                    cardIndex= cardIndex + 1;
                    return {
                        id: cardIndex,
                        description: line
                    };
                });
                setCards([...cards, ...filelst]);
            };
            reader.readAsText(files[i]);
        }}

    const handleDownloadClick = (event) =>{
        const myList = cards.map((card) => card.description);
        const myFileName = "myList.txt";
        downloadListAsTextFile(myList, myFileName);
    }


    const handleDescriptionChange = (event) => {
        setNewCard({ ...newCard, description: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setCards([
            ...cards,
            {
                id: cards.length > 0 ? Math.max(...cards.map((card) => card.id)) + 1 : 1,
               // id: Math.max(...cards.map((card) => card.id)) + 1,
                description: newCard.description,

            },
        ]);
        setNewCard({ description: "" });
    };

    const handleDelete = (id) => {
        setCards(cards.filter((card) => card.id !== id));
    };

    return (
        <div>
            <div className="card-grid">

                <form onSubmit={handleSubmit} className={'form'}>

                    <label className={'label'}>

                        <textarea className='card'
                            value={newCard.description}
                            onChange={handleDescriptionChange}
                        />
                    </label>
                    <button type="submit">Add</button>
                </form>
            </div>

        <div className="card-grid" id='cards'>
            {cards.map((card) => (
                <div className="card" key={card.id}>
                    <p>{card.description}</p>
                    <button  onClick={() => handleDelete(card.id)} >Delete</button>
                </div>
            ))}
        </div>
            <div className={"card-grid"} >
                <button  onClick={handleDownloadClick}>Download List</button>
                <input type="file" onChange={handleFileUpload} multiple />
            </div>

        </div>
    );
}

export default App;
