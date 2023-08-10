import { My } from "./parser.mjs";

const test1 = () => {
  console.log("test1");

  const p = new My(`
print 1
print 52
`);
  // console.log(p);
  const arr = Array.from(p.tokens());
  console.log(arr);
};

const test2 = () => {
  console.log("test2");

  const p = new My(`
print 1
print "foo"
`);

  const arr = Array.from(p.tokens());
  console.log(arr);
};

const test3 = () => {
  console.log("test3");

  const p = new My(`
print 1
print 52
`);

  const token_feed = p.tokens();
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
  console.log(token_feed.next());
};

const test4 = () => {
  console.log("test4");

  const p = new My(`
print 1
print 52
`);

  console.log(p.next_token());
  console.log(p.next_token());
  p.return_token(["number", 1]);
  console.log(p.next_token());
  console.log(p.next_token());
};

const test5 = () => {
  console.log("test5");

  let p = new My(`
print 1
print 52
`);

  console.log(p.run());
};

const test6 = () => {
  console.log("test6");

  let p = new My(`
print 1
print
`);

  console.log(p.run());
};

const test7 = () => {
  console.log("test7");

  let p = new My(`
print 1 2
`);

  console.log(p.run());
};

const test8 = () => {
  console.log("test8");

  let p = new My(`
print 1
print 52
`);

  console.log(p.run());
};

test8();
