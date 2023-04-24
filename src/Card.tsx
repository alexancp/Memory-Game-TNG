export function Card(props: { label: any; flipped: boolean; setFlipped: any }) {
  let content = null;
  if (props.flipped) content = props.label;

  return (
    <div className="Card" onClick={() => props.setFlipped()}>
      {content}
    </div>
  );
}
