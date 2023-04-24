import "./styles.css";
import { Field } from "./Field";

export default function App() {
  return (
    <div className="App">
      <h1>{"Memory game"}</h1>
      <div className="CenteredBox">
        <Field n_pairs={4} />
      </div>
    </div>
  );
}
