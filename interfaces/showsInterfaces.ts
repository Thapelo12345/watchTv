interface SERIES {
  _id: string;
  seriesHeader: string;
  seriesTag: string;
  seriesLanguage: string;
  seriesDescription: string;
  seriesImageUrl: string;
  seriesYear: string;
  seriesRating: number;
  seriesGenres: [string];
  seriesCast: [
    {
      actorRealName: string;
      actorCharacter: string;
      actorImage: string;
    },
  ];
  seriesSeasons: [
    {
      season: string;
      episodes: [{ name: string; title: string; play: string }];
    },
  ];
}

interface MOVIE {
  _id: string;
  movieHeader: string;
  movieTag: string;
  movieLanguage: string;
  movieDescription: string;
  movieImageUrl: string;
  movieYear: string;
  movieRating: number;
  movieGenres: [string];
  movieCast: [
    {
      actorRealName: string;
      actorCharacter: string;
      actorImage: string;
    },
  ];
  playableUrl: string;
}

export { SERIES, MOVIE}
