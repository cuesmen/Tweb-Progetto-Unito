/**
 * Actor profile domain model.
 * @module ActorInfo
 * @category Models
 */
export default class ActorInfo {
    constructor({
      actorId,
      biography,
      placeOfBirth,
      birthday,
      name,
      gender,
      genderText,
      popularity,
      deathday,
      imagePath,
      imageUrl,
    }) {
      Object.assign(this, {
        actorId,
        biography,
        placeOfBirth,
        birthday,
        name,
        gender,
        genderText,
        popularity,
        deathday,
        imagePath,
        imageUrl,
      });
    }
  
    static fromApi(d = {}) {
      return new ActorInfo({
        actorId: d.actorId ?? null,
        biography: d.biography ?? '',
        placeOfBirth: d.placeOfBirth ?? '',
        birthday: d.birthday ?? null,
        name: d.name ?? '',
        gender: d.gender ?? null,
        genderText: d.genderText ?? null,
        popularity: d.popularity ?? null,
        deathday: d.deathday ?? null,
        imagePath: d.imagePath ?? null,
        imageUrl: d.imageUrl ?? null, 
      });
    }
  }
  
