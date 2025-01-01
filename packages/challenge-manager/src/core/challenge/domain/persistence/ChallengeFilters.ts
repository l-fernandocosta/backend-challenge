
export default class ChallengeFilters {
  readonly title?: string;
  readonly description?: string;
  
  constructor(title?: string, description?: string){
    this.title = title;
    this.description = description;
  }

  static create(filters: { title?: string, description?: string }): ChallengeFilters {
    return new ChallengeFilters(filters.title, filters.description);
  }

  public toPrismaQuery(){
    const query : any = {} ;

    if(this.title){
      query.title = {contains: this.title, mode: 'insensitive'};
    }

    if(this.description){
      query.description = {contains: this.description, mode: 'insensitive'};
    }

    return query;
  }
}