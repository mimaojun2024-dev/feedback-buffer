import { useEffect, useMemo, useState } from 'react';
import HomeShortcut from './HomeShortcut';
import AxisRail from './AxisRail';
import { MAIN_AXIS_LIST_LIMIT, getStoredMainAxisSection, setStoredMainAxisSection } from '../lib/buffer';

function createEmptyEntries() {
  return Array.from({ length: MAIN_AXIS_LIST_LIMIT }, () => ({
    task: ''
  }));
}

function hasEntries(entries) {
  return entries.some((entry) => entry.task);
}

export default function AxisListPage({
  sectionId,
  badge,
  title,
  accent,
  description
}) {
  const [entries, setEntries] = useState(createEmptyEntries());
  const [isEditing, setIsEditing] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const storedEntries = getStoredMainAxisSection(sectionId);
    const safeEntries = Array.isArray(storedEntries) ? storedEntries : createEmptyEntries();

    setEntries(safeEntries);
    setIsEditing(!hasEntries(safeEntries));
    setHasLoaded(true);
  }, [sectionId]);

  function handleChange(index, field, value) {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              [field]: value
            }
          : entry
      )
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextAxis = setStoredMainAxisSection(sectionId, entries);
    setEntries(nextAxis[sectionId]);
    setIsEditing(false);
  }

  const filledEntries = useMemo(
    () => entries.filter((entry) => entry.task),
    [entries]
  );

  return (
    <main className="shell">
      <section className="panel">
        <div className="screenTop">
          <p className="eyebrow">Main Axis</p>
          <div className="screenTopActions">
            <HomeShortcut />
            <p className="counter counterBadge">{badge}</p>
          </div>
        </div>

        <div className="stack phaseCard">
          <AxisRail currentLevel={sectionId} />
          <h1 className="title axisTitle">
            <span className="titleLine">{title}</span>
            <span className="titleLine accentLine">{accent}</span>
          </h1>
          <p className="body axisMeta">{description}</p>

          {isEditing ? (
            <form className="taskEditor axisEditor" onSubmit={handleSubmit}>
              {entries.map((entry, index) => (
                <section key={`${sectionId}-${index}`} className="axisEntryCard">
                  <p className="taskLabel">第 {index + 1} 条重点</p>
                  <textarea
                    className="taskInput axisInput"
                    rows="2"
                    value={entry.task}
                    onChange={(event) => handleChange(index, 'task', event.target.value)}
                    placeholder="写下这一层最重要的一件事"
                  />
                </section>
              ))}
              <button type="submit" className="taskSubmitButton">
                保存这几条
              </button>
            </form>
          ) : (
            <section className="axisSummaryList" aria-label={`${title}摘要`}>
              {filledEntries.map((entry, index) => (
                <article key={`${sectionId}-saved-${index}`} className="axisSummaryItem">
                  <p className="axisSummaryIndex">重点 {index + 1}</p>
                  <p className="axisSummaryTask">{entry.task}</p>
                </article>
              ))}
            </section>
          )}
        </div>

        <div className="screenBottom buttonGroup">
          {hasLoaded && !isEditing ? (
            <button type="button" className="textButton axisEditButton" onClick={() => setIsEditing(true)}>
              修改这几条
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
