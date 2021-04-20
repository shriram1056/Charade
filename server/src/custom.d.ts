declare namespace Express {
  export interface Request {
    userId: number
    username: string
  }
}
//Use declare namespace to describe types or values accessed by dotted notation.

//namespace and modules both are same.but namespace should be used for internal module
//The internal modules are now used for ambient namespace declarations.

// look for the stackoverflow post in typescript

//declare namespace to describe types or values accessed by dotted notation
