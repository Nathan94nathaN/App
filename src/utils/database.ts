import { connect } from "mongoose";

export default async function database(uri: string) {
  return connect(uri);
}
