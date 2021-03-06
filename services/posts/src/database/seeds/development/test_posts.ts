import * as Knex from 'knex';

export const testPosts = [
  {
    body: 'test content hahah',
    created_at: '2019-07-30 18:28:45.901000',
    deleted_at: null,
    id: '708a0b9e-0c33-4805-9344-ae29963c5052',
    thumnail:
      'https://www.koreatimes.net/images/attach/120822/20190726-16075586.png',
    title: 'test_post_1',
    updated_at: null,
    user_id: '708a0b9e-0c33-4805-9344-ae29963c5051',
  },
  {
    body: 'test content 2 hahah',
    created_at: '2019-06-30 18:28:45.901000',
    deleted_at: null,
    id: 'c25ebeec-8207-4e5c-aa48-fbff64a198ba',
    thumnail:
      'https://i.pinimg.com/474x/28/85/25/2885257b0695245df64414b8b398c0cc.jpg',
    title: 'test_post_2',
    updated_at: null,
    user_id: '708a0b9e-0c33-4805-9344-ae29963c5051',
  },
];

export async function seed(knex: Knex): Promise<any> {
  return knex('posts')
    .del()
    .then(() => {
      return knex('posts').insert(testPosts);
    });
}
