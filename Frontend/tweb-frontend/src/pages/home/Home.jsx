import DefaultPage from "../../components/DefaultPage";

export default function Home() {

    return (
        <>
            <DefaultPage loadingMessage="Caricamento home…">
                <div className="home-page">
                    <h1>Benvenuto su MoviePoint</h1>
                    <p>Esplora il nostro vasto catalogo di film e serie TV. Trova i tuoi preferiti, guarda trailer e leggi recensioni.</p>
                    <p>Inizia la tua avventura cinematografica con noi!</p>
                </div>
            </DefaultPage>
        </>
    );
}