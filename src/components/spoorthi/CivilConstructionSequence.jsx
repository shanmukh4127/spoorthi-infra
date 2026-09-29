function CivilConstructionSequence({ items }) {
  return <ol className="civil-sequence-list">{items.map(item => <li key={item.number}><div className="civil-sequence-list__copy"><span className="type-label">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></div><span className="civil-sequence-list__line" aria-hidden="true" /></li>)}</ol>
}
export default CivilConstructionSequence
