const base = 'https://elearning-aueb.herokuapp.com';

const uri = {
  base: base,
  images: `${base}/static/images`,
  courses: {
    title: `${base}/courses/search?title`,
    id: `${base}/courses/search?category`
  },
  categories: `${base}/categories`
};

exports.uri = uri;
