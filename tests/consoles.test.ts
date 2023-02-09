import app from "app";
import supertest from "supertest";
import prisma from "config/database";
import { inputConsole } from "./factories/console-factory";
import httpStatus from "http-status";

beforeAll(async()=> {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})


const server = supertest(app);

describe("GET /consoles", () => {
    it("should respond with a list of consoles that are on the database", async ()=>{
        const console = await inputConsole()

        const response = await server.get("/consoles")
        expect(response.body).toEqual(expect.arrayContaining([
            {
                id: console.id,
                name: console.name
            }
        ]))
    })
})

describe("GET /consoles/:id", () => {
    it("should respond with Console Not Found if the id does not relate to any console", async ()=>{

        const response = await server.get('/consoles/9999')
        expect(response.statusCode).toEqual(httpStatus.NOT_FOUND)
    })

    it("should respond with the console related to the informed id", async ()=>{
        const console = await inputConsole()

        const response = await server.get(`/consoles/${console.id}`)
        expect(response.body).toEqual(
            {
                id: console.id,
                name: console.name
            }
        )
    })
})

describe("POST/consoles", () => {
    it("should respond with -This console already exists!- if that console input have already been done", async ()=>{
        const console = await inputConsole()

        const response = await server.post("/consoles").send({name:console.name})
        expect(response.statusCode).toEqual(httpStatus.CONFLICT)
    })

    it("should respond with with httpStatus.CREATED", async ()=>{

        const response = await server.post("/consoles").send({name:"Nintendinho"})
        expect(response.statusCode).toEqual(httpStatus.CREATED)
    }) 
})