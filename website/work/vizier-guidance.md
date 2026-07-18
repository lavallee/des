# Vizier implementation guidance

Private working receipt. Artoo keeps this file outside `site/`; it is not deployed.

## Invocation

- Generated: `2026-07-18T14:18:15+00:00`
- Working directory: `/media/ubuntussd/home/lavallee/Projects/des/website`
- Executable: `/media/ubuntussd/home/lavallee/Projects/vizier/.venv/bin/vizier`
- Exit status: `0`

```text
vizier guide 'help a newcomer choose among four audience-specific design modes and understand that variance, density, motion, typography, and imagery are independent dials rather than a single maturity scale' --context 'DES documentation site. Modes: operator, public-data, editorial, marketing. The reader must choose a starting mode, inspect real Lyra Forge examples, generate a model/harness profile, and understand shared accessibility and evidence constraints. Avoid numeric scoring, ranking, and a universal house style.' --n-series 4 --forms 4 --prior 6 --no-semantic
```

## Standard output

# Vizier implementation guide

Job: help a newcomer choose among four audience-specific design modes and understand that variance, density, motion, typography, and imagery are independent dials rather than a single maturity scale
Context: DES documentation site. Modes: operator, public-data, editorial, marketing. The reader must choose a starting mode, inspect real Lyra Forge examples, generate a model/harness profile, and understand shared accessibility and evidence constraints. Avoid numeric scoring, ranking, and a universal house style.

Recommended forms:
1. Box-and-jitter-strip (box-and-jitter-strip) [Distribution]
   A boxplot overlaid (or adjacent) with every point jittered out so sample size and density show. Gets the summary-stat read of a boxplot and the honest-every-point read of a strip plot, at the cost of a denser chart. The honest small-N compromise.
2. Boxplot (boxplot) [Distribution]
   A five-number summary per group: min, Q1, median, Q3, max, with outliers as dots. Tukey's invention for quick distribution comparison across many groups. Loses shape detail (bimodality hides inside the box); wins on compactness.
3. Histogram (histogram) [Distribution]
   Bars representing binned counts of a single continuous variable. The default tool for "what does this distribution look like?" — shape, spread, skew, modality. Bin-width choice shapes what you see; tune it.
4. Ridgeline plot (ridgeline) [Distribution]
   Stacked density curves, one per group, overlapping slightly. The form Wilkinson called "joyplot" — scales to 10-30 groups better than boxplot or violin by trading some vertical space for shape fidelity.

Implementation checks:
- Reader decision: Write the sentence: after reading this, the audience should be able to decide, compare, or understand X. If X is only 'see the data,' the module needs a sharper job.
- Headline claim: State the one factual claim the chart must carry before picking labels, annotations, or prose. Build the chart backward from that claim.
- Fair comparison: Name the benchmark that makes the value interpretable: statewide, county, district overall, same-level peers, prior period, target, or a documented 'no fair comparison available'.
- Unit and denominator: Put the unit in the axis/caption and name the denominator near the chart: percent of what, dollars per whom, count of which rows, or share of which total.
- Counter-reading: List the most likely wrong reading and block it in the caption or annotation rather than burying it in distant methodology text.
- Reader affordance: Provide direct labels, a legend, endpoint labels, and tooltip/table fallbacks appropriate to the chart. Do not make color carry the only meaning.

Prior-art signals:
- weaver/principle-denominators-and-cut-dates-travel-with-the-data: Denominators and cut dates travel with the data (fts5:extension-db)
- weaver/project-maplewood-profile: maplewood-profile: Maplewood — retrospective notes (fts5:extension-db)
- weaver/project-new-bern-profile: new-bern-profile: New Bern — retrospective notes (fts5:extension-db)
- weaver/principle-state-the-headline-claim-before-building: State the headline claim before building (fts5:extension-db)
- weaver/principle-what-the-data-can-and-can-t-say: What the data can and can't say (fts5:extension-db)
- weaver/principle-put-percentages-next-to-labels: Put percentages next to labels (fts5:extension-db)

## Standard error

(none)
