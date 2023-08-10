export { My };

const isNumeric = (c) => /\d+$/.test(c);
const isAlpha = (c) => /[a-zA-Z]/.test(c);

class My {
  constructor(code) {
    this.code = code;
    this.line_nr = 0;
    this.token_feed = this.tokens();
    this.returned_token = null;
    this.stack = [];
    this.vars = new Map();
  }
}

const m = My;

//// lexer

m.prototype.raise_error = function (message) {
  throw new Error(`${this.line_nr}: ${message}`);
};

m.prototype.tokens = function* () {
  for (const line of this.code.trim().split("\n")) {
    this.line_nr += 1;

    for (const token of line.trim().split(" ")) {
      // console.log(`token: ${token}`);

      if (["print", "="].includes(token)) {
        yield [token];
      } else if (isNumeric(token)) {
        // yield [kind, value]
        yield ["number", Number(token)];
      } else if (isAlpha(token[0])) {
        // first letter is alphabet
        // yield [kind, value]
        yield ["identifier", token];
      } else {
        this.raise_error(`Syntax Error: Invalid token ${token}`);
      }
    }

    yield ["\n"];
  }
};

m.prototype.next_token = function () {
  let token = null;

  if (this.returned_token) {
    token = this.returned_token;
    this.returned_token = null;
  } else {
    const item = this.token_feed.next();

    if (!item.done) {
      token = item.value;
    }
  }

  return token;
};

m.prototype.return_token = function (token) {
  if (this.retrurned_token != null) {
    throw new Error("Cannot return more than one token at a time");
  }
  this.returned_token = token;
};

//// parser

m.prototype.parse_program = function () {
  if (!this.parse_statement()) {
    this.raise_error("Expected: statement");
  }

  let token = this.next_token();
  while (token) {
    this.return_token(token);
    if (!this.parse_statement()) {
      this.raise_error("Expected: statement");
    }
    token = this.next_token();
  }

  return true;
};

m.prototype.parse_statement = function () {
  if (!this.parse_print_statement() && !this.parse_assignment()) {
    this.raise_error("Expected: print statement or assignment");
  }

  let token = this.next_token();
  if (token[0] != "\n") {
    this.raise_error("Expected: end of line");
  }

  return true;
};

m.prototype.parse_print_statement = function () {
  let token = this.next_token();

  if (token[0] != "print") {
    this.return_token(token);
    return false;
  }

  if (!this.parse_expression()) {
    this.raise_error("Expected: expression");
  }

  let value = this.stack_pop();
  console.log(value);

  return true;
};

m.prototype.parse_assignment = function () {
  let token = this.next_token();

  if (token[0] != "identifier") {
    this.return_token(token);
    return false;
  }

  let identifier = token[1];
  token = this.next_token();

  if (token[0] != "=") {
    this.raise_error("Expected: =");
  }

  if (!this.parse_expression()) {
    this.raise_error("Expected: expression");
  }

  this.vars.set(identifier, this.stack_pop());
  return true;
};

m.prototype.parse_expression = function () {
  let token = this.next_token();

  if (!["number", "identifier"].includes(token[0])) {
    this.return_token(token);
    return false;
  }

  if (token[0] == "identifier") {
    if (!this.vars.has(token[1])) {
      this.raise_error(`Syntax Error: Unknown variable ${token[1]}`);
    } else {
      this.stack_push(this.vars.get(token[1]));
    }
  } else {
    // token[0] == "number"
    this.stack_push(token[1]);
  }

  return true;
};

m.prototype.run = function () {
  try {
    return this.parse_program();
  } catch (e) {
    console.error(e);
  }
};

m.prototype.stack_push = function (arg) {
  this.stack.push(arg);
};

m.prototype.stack_pop = function (arg) {
  return this.stack.pop(arg);
};
