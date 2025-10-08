import React from 'react';
import DefaultPage from "../../components/DefaultPage";
import FilmContainer from './FilmContainer';

export default function Film() {
  return (
    <DefaultPage loadingMessage="Caricamento film…">
      <div className="film-page">
      <FilmContainer />
    </div>
    </DefaultPage>
  );
}

