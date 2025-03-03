import { setupServer } from "msw/node";
import { http } from "msw";

const mockUserData = {
  data: {
    fullname: "Test User",
    imgUrl: "https://images.news.ru/photo/da5c48b2-9ba5-11ef-8b00-02420a0000c9_1024.jpg",
  },
};

export const handlers = [
  http.get("http://localhost:5001/profile", (req, res, ctx) => {
    return res(ctx.json(mockUserData));

  })
];

export const server = setupServer(...handlers);
