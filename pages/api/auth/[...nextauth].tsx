import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb"; 
import { addUser } from "../../../lib/userService"; 
import { User } from "@/models/User";


// TypeScript configuration for NextAuth options
export const authOptions: NextAuthOptions = {
    
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google"
        }
      }
    })
    
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    
    async signIn({ user }) {
      try {
        const client: MongoClient = await clientPromise;
        const db = client.db("supremoDatabase");
    
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await db.collection("users").findOne({ email: user.email });
    
        if (!existingUser) {
          const userName = user.name; 
        
         
          const newUser: User = {
            firstName: typeof userName === 'string' ? userName.split(" ")[0] : "",
            lastName: typeof userName === 'string' ? userName.split(" ")[1] : "",  
            dateOfBirth: new Date(),              
            address: [0,0],                            
            phoneNumber: "", 
            email:user.email||""                      
          };
        
          await addUser(newUser); 
        }
        return true;
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        return false; // Empêche la connexion si une erreur survient
      }
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: { token: JWT, account: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token ,user}: { session: any, token: JWT,user:AdapterUser }) {
        console.log(user);
      console.log("Token reçu dans session callback:", token.accessToken);
      session.accessToken = token.accessToken;
      return session;
    },
  },
};


export default NextAuth(authOptions);
