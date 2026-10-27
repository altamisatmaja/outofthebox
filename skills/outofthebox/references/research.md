# Research behind the rules

Each source below is peer reviewed or a widely used practitioner reference.
For each one: what it found, and what the agent does because of it. Venue
types are given; journal quartiles (Q1 to Q4) change yearly, so check SJR or
JCR for the current ranking before citing one in a paper.

Only findings confirmed from the paper, its abstract or its publisher page
are stated. Where a number came from a secondary summary, it says so.

## Journals

### The oracle problem
**Barr, Harman, McMinn, Shahbaz, Yoo. "The Oracle Problem in Software
Testing: A Survey." IEEE Transactions on Software Engineering 41(5),
507 to 525, 2015. DOI 10.1109/TSE.2014.2372785.**
Deciding whether an output is correct is the hard part of testing. Oracles
come from specifications, models, contracts, metamorphic relations, and in
the end a human.
*Agent does:* O-03 and O-15. Every check names its oracle: the stored row,
the balance on both sides, the sentence on screen. "No error" is not an
oracle.

### Metamorphic testing
**Segura, Fraser, Sanchez, Ruiz-Cortés. "A Survey on Metamorphic Testing."
IEEE TSE 42(9), 805 to 824, 2016. DOI 10.1109/TSE.2016.2532875.**
**Chen et al. "Metamorphic Testing: A Review of Challenges and
Opportunities." ACM Computing Surveys 51(1), article 4, 2018.
DOI 10.1145/3143561.**
When the exact expected output is unknown, check how the output must change
when the input changes.
*Agent does:* when there is no exact expected value, assert a relation:
dividing a payment into three instalments sums to the total; adding a filter never
returns more rows; the same search in two languages returns the same ids.

### Combinatorial interaction
**Kuhn, Wallace, Gallo. "Software Fault Interactions and Implications for
Software Testing." IEEE TSE 30(6), 418 to 421, 2004.
DOI 10.1109/TSE.2004.24.**
Failures across several domains were triggered by combinations of few
conditions; NIST's later work reports no more than six interacting factors
in the failures it studied.
*Agent does:* O-08. Cross the axes in pairs at least (actor by state, state
by time, input by environment), not one axis at a time.

### Regression selection and prioritization
**Yoo, Harman. "Regression Testing Minimization, Selection and
Prioritization: A Survey." Software Testing, Verification and Reliability
22(2), 67 to 120, 2012. DOI 10.1002/stvr.430.**
*Agent does:* O-13. Run the checks nearest the change first for speed, but
O-10 still requires the full suite before handing over.

### Mutation testing
**Jia, Harman. "An Analysis and Survey of the Development of Mutation
Testing." IEEE TSE, 2011.**
**Petrović, Ivanković, Fraser, Just. "Practical Mutation Testing at Scale:
A View from Google." IEEE TSE, 2021. DOI 10.1109/TSE.2021.3107634.**
A test suite's strength is how many small deliberate bugs it catches, not
how many lines it runs.
*Agent does:* O-07 is a one-mutant version of this: put the old code back
(the real mutant) and watch the new check fail.

### Fuzzing
**Manès et al. "The Art, Science, and Engineering of Fuzzing: A Survey."
IEEE TSE 47(11), 2312 to 2331. DOI 10.1109/TSE.2019.2946563.**
Repeatedly run the program with generated inputs that may be malformed.
*Agent does:* the "Which input" axis: empty, huge, malformed, unicode,
markup, pasted formatting, and inputs one byte off a valid one.

### Flaky tests
**Parry, Kapfhammer, Hilton, McMinn. "A Survey of Flaky Tests." ACM
Transactions on Software Engineering and Methodology 31(1), article 17.
DOI 10.1145/3476105.** (76 papers surveyed.)
*Agent does:* O-14. Freeze clocks, seed randomness, no sleeps, isolated data.

### Configuration errors
**Xu, Zhou. "Systems Approaches to Tackling Configuration Errors: A
Survey." ACM Computing Surveys 47(4), 2015. DOI 10.1145/2791577.**
*Agent does:* O-01 and O-12. Read the config the suite and the product
actually use before trusting either.

### Test smells
**Palomba et al.** (221 releases of ten systems): tests with smells such as
Eager Test and Assertion Roulette are more change and defect prone, and
production code tested by them is more defect prone.
*Agent does:* one behaviour per check, named after the behaviour, with
assertion messages that say which part failed.

### Risk-based testing
**Felderer, Schieferdecker. "A Taxonomy of Risk-Based Testing."
International Journal on Software Tools for Technology Transfer, 2014.**
*Agent does:* O-13. Rank by impact times likelihood: money and data, then
security, then flows, then looks.

### Machine learning systems
**Zhang, Harman, Ma, Liu. "Machine Learning Testing: Survey, Landscapes and
Horizons."** (144 papers; correctness, robustness, fairness; data, program,
framework.) Journal version in IEEE TSE; check the volume and year.
**Humbatova et al. "Taxonomy of Real Faults in Deep Learning Systems,"
ICSE 2020** (1,059 artefacts, 15 fault categories).
*Agent does:* the hardware, robotics and simulation pack; test data and
model as well as code.

## Conferences

### Error handling is where the catastrophes are
**Yuan et al. "Simple Testing Can Prevent Most Critical Failures." OSDI
2014.** 198 user reported failures in Cassandra, HBase, HDFS, MapReduce and
Redis. Most catastrophic failures could have been prevented by simple
testing of error handling code. A secondary summary reports 92% came from
mishandled non fatal errors, and names handlers that only log, handlers
marked TODO, and handlers that catch an over broad exception.
*Agent does:* the "What state" axis, half done branch. For every outside
call, ask what was written before it and what is true when it fails.

### Concurrency bugs
**Lu, Park, Seo, Zhou. "Learning from Mistakes: A Comprehensive Study on
Real World Concurrency Bug Characteristics." ASPLOS 2008.** 105 bugs: about
a third of non deadlock bugs break an intended order, about 34% involve
several variables, about 92% trigger by forcing an order among at most four
memory accesses.
**Leesatapornwongsa et al. "TaxDC." ASPLOS 2016.** 104 distributed
concurrency bugs; caused by the non deterministic order of message
arrivals, crashes and reboots.
*Agent does:* the "When" axis: twice, late, out of order, and two requests
through the same check.

### Partial failures and retries
**Lou, Huang, Smith. OmegaGen. NSDI 2020.** 100 real partial failures in
five systems.
**Stoica, Lu et al. Retry bugs and the Wasabi tool. SOSP 2024.**
*Agent does:* the API skill: retries, idempotency keys, timeouts, and what
is half written when a consumer dies.

### Cloud outages
**Gunawi et al. "Why Does the Cloud Stop Computing? Lessons from Hundreds
of Service Outages." SoCC 2016.** 597 unplanned outages across 32 services.
**Gunawi et al. "What Bugs Live in the Cloud?" SoCC 2014.** 3,000+ issues.
*Agent does:* dependencies of dependencies; a provider down is a case.

### Coverage and mutants
**Just et al. "Are Mutants a Valid Substitute for Real Faults in Software
Testing?" FSE 2014.** 357 real faults: mutant detection correlates with
real fault detection independently of coverage.
**Inozemtseva, Holmes. "Coverage Is Not Strongly Correlated with Test
Suite Effectiveness." ICSE 2014.**
*Agent does:* never report coverage as proof; report the old version failing.

### Flaky root causes
**Luo, Hariri, Eloussi, Marinov. "An Empirical Analysis of Flaky Tests."
FSE 2014.** 201 fixes in 51 projects; causes include async wait,
concurrency, test order, resource leaks, network, time, IO, randomness,
floating point and unordered collections.

### Date and time
**Tiwari et al. "It's About Time: An Empirical Study of Date and Time Bugs
in Open Source Python Software." MSR 2025.** 151 bugs; time zones were the
largest contributing factor.
*Agent does:* the "When" axis always includes the time zone of the
location, the server and the user.

### Mobile
**Fan et al. "Large-Scale Analysis of Framework-Specific Exceptions in
Android Apps." ICSE 2018.** 16,245 exception traces from 2,486 apps.

### Exploratory vs scripted
**Itkonen, Mäntylä, Lassenius. "Defect Detection Efficiency: Test Case
Based vs. Exploratory Testing." ESEM 2007.** No significant difference in
defect detection efficiency; test case based testing produced more false
reports. Houdek et al. (2002) found exploratory testing took less effort.
*Agent does:* the QA skill runs both: scripted cases for the flow,
exploratory charters for the unexpected.

### Property based testing
**Goldstein et al. "Property-Based Testing in Practice." ICSE 2024.** 30
interviews at a firm that uses it heavily.
*Agent does:* when a rule holds for all inputs (rounding sums to the total,
encode then decode is identity), state it as a property and generate inputs.

### Chaos engineering
**Basiri et al. "Chaos Engineering." IEEE Software 33(3), 35 to 41, 2016.**
Define steady state, hypothesize it holds, inject real world failures,
look for differences.
*Agent does:* in test environments only (O-02).

### AI written tests
Recent studies of LLM generated unit tests (2024 to 2026, mostly preprints
and industry papers) report hallucinated symbols causing compilation
failures, and tests that run but carry weak assertions.
*Agent does:* this is why O-07 exists. A generated check that never failed
proves nothing.

### Formal specification in industry

- **Newcombe, Rath, Zhang, Munteanu, Brooker and Deardeuff, "How Amazon Web
  Services Uses Formal Methods", Communications of the ACM 58(4), 2015:**
  engineers wrote TLA+ specifications of the designs of production systems
  and checked them with the TLC model checker, which found subtle bugs in
  those designs. The basis of `outofthebox-formal`.

## Practitioner references

- **Whittaker, Exploratory Software Testing (2009):** tours such as money,
  landmark, bad data, configuration and garbage collector. See
  [heuristics](heuristics.md).
- **Bach, Heuristic Test Strategy Model:** SFDIPOT, what to vary.
- **Bolton, HICCUPPS(F):** oracle heuristics, how to judge a result.
- **Falsehoods programmers believe** lists (names, time, addresses,
  prices): the "Which input" and "When" axes.
- **Global App Testing, The Ultimate QA Testing Handbook:** narrow, cohesive
  test cases phrased as an action and a question; testing in an environment
  separate from development; localization, exploratory, functional,
  regression and usability chapters.
- **qa-testing-guide (aeshamangukiya, GitHub):** test plan, RTM, bug
  lifecycle, exploratory charters, risk-based testing, web, mobile and API
  checklists.
- **Edge case articles (figr.design, virtuosoqa.com, qacraft.com):** input,
  state, permissions, network, time, scale, concurrency, recovery,
  integrations; boundary value analysis, equivalence partitioning,
  persona and attack based exploration.

## Links

- https://dl.acm.org/doi/10.1109/TSE.2014.2372785
- https://eprints.whiterose.ac.uk/110335/1/segura16-tse.pdf
- https://eprints.nottingham.ac.uk/51607
- https://csrc.nist.gov/pubs/journal/2004/06/software-fault-interactions-and-implications-for-s/final
- https://dspace.kaist.ac.kr/handle/10203/200853
- https://homes.cs.washington.edu/~rjust/publ/practical_mutation_testing_tse_2021.pdf
- https://arxiv.org/pdf/1812.00140
- https://dl.acm.org/doi/abs/10.1145/3476105
- https://dl.acm.org/doi/10.1145/2635868.2635920
- https://www.eecg.utoronto.ca/~stumm/Papers/Yuan-OSDI-14.pdf
- https://www.cs.columbia.edu/~junfeng/08fa-e6998/sched/readings/concurrency-bugs.pdf
- https://www.cs.jhu.edu/~chlou/paper/omegagen-nsdi20.pdf
- https://www.ece.iastate.edu/~mai/docs/papers/2016_SoCC_COS.pdf
- https://homes.cs.washington.edu/~mernst/pubs/mutation-effectiveness-fse2014-abstract.html
- https://par.nsf.gov/biblio/10651549
- https://dl.acm.org/doi/10.1145/2699417
- https://arxiv.org/pdf/1801.07009
- https://ieeexplore.ieee.org/document/4343733/
- https://cis.upenn.edu/~bcpierce/papers/icse24-pbt-in-practice
- https://arxiv.org/pdf/1702.05843
- https://arxiv.org/abs/1906.10742
- https://arxiv.org/pdf/1910.11015
- https://www.ischieferdecker.bplaced.net/publications/2014/Felderer2014%20-%20A%20Taxonomy%20of%20Risk%20Based%20Testing.pdf
- https://github.com/aeshamangukiya/qa-testing-guide
- https://figr.design/blog/edge-case-examples-software
- https://www.virtuosoqa.com/post/edge-case-testing
- https://qacraft.com/how-to-identify-edge-cases-in-testing/
