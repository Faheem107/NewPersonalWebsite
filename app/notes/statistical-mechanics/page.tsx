"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

// ---------------------------------------------------------
// UI Components
// ---------------------------------------------------------

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }}
      className="mb-24"
    >
      <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight mb-8 border-b border-border/40 pb-4 text-foreground/90">
        {title}
      </h2>
      <div className="space-y-6 text-[16px] text-muted-foreground leading-[1.8]">
        {children}
      </div>
    </motion.section>
  )
}

function Eq({ math, label }: { math: string; label?: string }) {
  return (
    <div className="my-10 px-6 py-6 border-l-[3px] border-foreground/30 bg-foreground/[0.02] dark:bg-white/[0.02] rounded-r-xl shadow-sm overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {label && <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 relative z-10">{label}</p>}
      <div className="overflow-x-auto pb-2 relative z-10">
        <BlockMath math={math} />
      </div>
    </div>
  )
}

function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/90 font-medium underline decoration-foreground/30 hover:decoration-foreground transition-colors">
      {children}
    </a>
  )
}

// Custom Placeholder for Google Images
function ImagePlaceholder({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="my-12 flex flex-col items-center">
      <div className="w-full max-w-2xl aspect-[16/9] bg-foreground/[0.02] dark:bg-[#0a0a0a] border-2 border-dashed border-foreground/15 dark:border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-foreground/30 transition-colors">
        {/* TO DO: Replace this div with an <img> tag referencing your Google Drive / Images */}
        <p className="text-muted-foreground/50 font-mono text-xs md:text-sm tracking-[0.15em] uppercase px-4 text-center">
          [ Insert Image: {alt} ]
        </p>
      </div>
      <p className="text-xs text-center mt-4 text-muted-foreground/60 font-mono tracking-wider uppercase max-w-lg">{caption}</p>
    </div>
  )
}

// ---------------------------------------------------------
// Main Page Content
// ---------------------------------------------------------

export default function StatMechPage() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-foreground/10">
      <CustomCursor />
      <Navigation />
      
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <article className="max-w-3xl mx-auto px-6 md:px-8 pt-36 pb-32">
        {/* Navigation Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-12">
          <Link href="/notes" className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors interactive inline-flex items-center gap-2" prefetch={true}>
            ← Back to Notes
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.215, 0.610, 0.355, 1.000] }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/60 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10">Physics</span>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/60 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10">Core Module</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight mb-6 leading-tight">
            Statistical Mechanics
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Thermodynamics gives us the laws of macroscopic systems. Mechanics gives us the laws of microscopic particles. Statistical Mechanics is the rigorous mathematical bridge that unites them. 
          </p>
        </motion.header>

        {/* 1. Introduction & Phase Space */}
        <Section title="1. Phase Space & The Ergodic Hypothesis" delay={0.1}>
          <p>
            Imagine a box of gas containing <InlineMath math="N \sim 10^{23}" /> molecules. If we wanted to solve this system using classical Newtonian mechanics, we would need to write down coupled differential equations for every single particle. Even if a supercomputer could track this, the resulting data—trillions of trajectories—would be utterly useless to us. We don't care about the trajectory of molecule #4,000,000. We care about macroscopic observables: pressure, temperature, and volume.
          </p>
          <p>
            To begin, we define the microscopic state of the entire system as a single point in a <InlineMath math="6N" />-dimensional manifold called <strong>Phase Space</strong> (<InlineMath math="\Gamma" />). This space is spanned by <InlineMath math="3N" /> generalized coordinates <InlineMath math="q_i" /> and <InlineMath math="3N" /> conjugate momenta <InlineMath math="p_i" />.
          </p>
          
          <ImagePlaceholder 
            alt="Phase space trajectory and Liouville's volume preservation" 
            caption="Fig 1: A point representing the entire system traces a trajectory through Phase Space. By Liouville's Theorem, a local volume of these points evolves like an incompressible fluid."
          />

          <p>
            As time ticks forward, the system evolves according to Hamilton's equations, and this point traces a trajectory through phase space. Instead of tracking a single system, Josiah Willard Gibbs introduced the concept of an <strong>Ensemble</strong>—an infinite collection of mental copies of our system, all in different microstates but sharing the same macroscopic constraints. 
          </p>
          <p>
            The foundation of this framework relies on the <Ref href="https://en.wikipedia.org/wiki/Ergodic_hypothesis">Ergodic Hypothesis</Ref>. It states that over a long period of time, the time spent by a system in some region of phase space of microstates with the same energy is proportional to the volume of this region. Simply put: <em>Time averages equal ensemble averages.</em>
          </p>
        </Section>

        {/* 2. The Microcanonical Ensemble */}
        <Section title="2. The Microcanonical Ensemble (Isolated Systems)" delay={0.15}>
          <p>
            Let us start with the simplest possible scenario: a completely isolated system. It cannot exchange energy (<InlineMath math="E" />), volume (<InlineMath math="V" />), or particles (<InlineMath math="N" />) with its surroundings. This is the <strong>Microcanonical Ensemble</strong>.
          </p>
          <p>
            In this isolated state, the system is governed by a singular, breathtakingly bold axiom known as the <em>Fundamental Postulate of Statistical Mechanics</em>:
          </p>
          <blockquote className="border-l-[3px] border-foreground/30 pl-5 italic my-8 text-foreground/80 font-serif text-lg">
            "In an isolated system in thermal equilibrium, every accessible microstate is equally probable."
          </blockquote>
          <p>
            Nature does not play favorites. If a microstate possesses the correct total energy <InlineMath math="E" />, the system is just as likely to be found in that state as any other. Let <InlineMath math="\Omega(N, V, E)" /> denote the total number of accessible microstates. The probability of finding the system in any specific microstate <InlineMath math="i" /> is simply <InlineMath math="P_i = 1/\Omega" />.
          </p>
          <p>
            Ludwig Boltzmann realized that this combinatorial counting was directly related to the macroscopic concept of entropy. His legendary formula, famously engraved on his tombstone in Vienna, is:
          </p>
          <Eq math="S = k_B \ln \Omega(N, V, E)" label="Boltzmann's Entropy" />
          <p>
            This equation fundamentally demystifies entropy. It is not some invisible thermodynamic fluid; it is simply a logarithmic measure of our ignorance. From this single equation, the entirety of thermodynamics can be derived. For example, temperature is defined geometrically as the slope of entropy with respect to energy:
          </p>
          <Eq math="\frac{1}{T} = \left( \frac{\partial S}{\partial E} \right)_{N,V}" label="Statistical Definition of Temperature" />
        </Section>

        {/* 3. The Canonical Ensemble */}
        <Section title="3. The Canonical Ensemble (Fixed Temperature)" delay={0.2}>
          <p>
            Isolated systems are mathematically beautiful, but experimentally rare. Real systems exchange heat with their environment. Imagine placing our small system <InlineMath math="S" /> in contact with an infinitely large thermal reservoir <InlineMath math="R" /> at a fixed temperature <InlineMath math="T" />. They can exchange energy, but the total energy <InlineMath math="E_{\text{tot}} = E_S + E_R" /> remains constant. This is the <strong>Canonical Ensemble</strong>.
          </p>
          <p>
            Because the reservoir is so massive, if our system adopts a microstate with a very high energy <InlineMath math="E_i" />, it robs the reservoir of that energy. The reservoir's entropy plummets, making this configuration highly statistically unlikely. Through a Taylor expansion of the reservoir's entropy, we find that the probability <InlineMath math="P_i" /> of our system being in state <InlineMath math="i" /> decays exponentially with energy. This is the <Ref href="https://en.wikipedia.org/wiki/Boltzmann_distribution">Boltzmann Distribution</Ref>:
          </p>
          <Eq math="P_i = \frac{1}{Z} e^{-\beta E_i} \quad \text{where} \quad \beta \equiv \frac{1}{k_B T}" label="The Boltzmann Factor" />
          
          <ImagePlaceholder 
            alt="Graph of the Boltzmann Distribution P(E) vs E for different temperatures" 
            caption="Fig 2: The exponential decay of microstate probability. Notice how at higher temperatures (lower beta), the distribution flattens, allowing the system to access higher energy states more frequently."
          />

          <p>
            The normalization constant <InlineMath math="Z" /> is arguably the most important quantity in all of physics. It is the <strong>Partition Function</strong> (from the German <em>Zustandssumme</em>, meaning "sum over states").
          </p>
          <Eq math="Z(N, V, T) = \sum_{i} e^{-\beta E_i}" label="The Canonical Partition Function" />
          <p>
            As Richard Feynman taught, "If you know the partition function, you know everything." It acts as a generating function for the thermodynamics of the system. By taking the logarithm of <InlineMath math="Z" />, we directly recover the Helmholtz Free Energy <InlineMath math="F" />:
          </p>
          <Eq math="F = -k_B T \ln Z" label="Helmholtz Free Energy" />
          <p>
            Once you have <InlineMath math="F" />, macroscopic observables are just derivatives. Pressure is <InlineMath math="P = -(\partial F / \partial V)_T" />. Entropy is <InlineMath math="S = -(\partial F / \partial T)_V" />. Average energy is <InlineMath math="\langle E \rangle = -(\partial \ln Z / \partial \beta)" />. The entire physics of the system is compressed into the algebraic form of <InlineMath math="Z" />.
          </p>
        </Section>

        {/* 4. The Grand Canonical Ensemble */}
        <Section title="4. The Grand Canonical Ensemble (Variable Particles)" delay={0.25}>
          <p>
            What if the system is open? What if it can exchange both heat <em>and</em> particles with the reservoir? This is the <strong>Grand Canonical Ensemble</strong>. The system is now defined by its volume <InlineMath math="V" />, temperature <InlineMath math="T" />, and <em>Chemical Potential</em> <InlineMath math="\mu" />.
          </p>
          <p>
            The chemical potential acts as the "cost" of adding a particle to the system. The probability of the system having exactly <InlineMath math="N" /> particles and being in microstate <InlineMath math="i" /> becomes:
          </p>
          <Eq math="P_{i,N} = \frac{1}{\mathcal{Z}} e^{-\beta(E_i - \mu N)}" label="Gibbs Factor" />
          <p>
            Here, <InlineMath math="\mathcal{Z}" /> is the Grand Partition Function. This ensemble might seem like a mathematical overcomplication, but it is an absolute necessity when dealing with quantum gases, where the number of particles in a specific quantum energy level is constantly fluctuating.
          </p>
        </Section>

        {/* 5. Classical Ideal Gas & The Gibbs Paradox */}
        <Section title="5. The Ideal Gas & Gibbs Paradox" delay={0.3}>
          <p>
            Let's apply this machinery to a classical ideal gas: <InlineMath math="N" /> non-interacting point particles in a box. Because they don't interact, the total energy is just the sum of their individual kinetic energies: <InlineMath math="\mathcal{H} = \sum p_i^2 / 2m" />. 
          </p>
          <p>
            When we calculate the partition function <InlineMath math="Z" /> by integrating over phase space, something bizarre happens. If we calculate the entropy, we find that it doesn't scale linearly with the size of the system. If we mix two identical boxes of identical gas, the math says the entropy increases—even though nothing physically changed! This is the <Ref href="https://en.wikipedia.org/wiki/Gibbs_paradox">Gibbs Paradox</Ref>.
          </p>
          <p>
            The resolution to this paradox required a radical, pre-quantum realization: <em>Particles of the same species are fundamentally indistinguishable.</em> We cannot label gas molecules as "Molecule A" and "Molecule B". Because of this, we overcounted the microstates by a factor of <InlineMath math="N!" /> (the number of ways to permute the particles). We must correct the partition function:
          </p>
          <Eq math="Z_N = \frac{1}{N!} (Z_1)^N" label="Indistinguishability Correction" />
          <p>
            Applying this correction yields the Sackur-Tetrode equation, which correctly describes the absolute entropy of a monatomic ideal gas and perfectly scales extensively.
          </p>
        </Section>

        {/* 6. Quantum Statistics */}
        <Section title="6. Quantum Statistics: Fermi-Dirac & Bose-Einstein" delay={0.35}>
          <p>
            The <InlineMath math="N!" /> correction was a classical patch to a quantum problem. In true quantum mechanics, the wavefunction of a multi-particle system must either be completely symmetric or completely antisymmetric under the exchange of two identical particles.
          </p>
          <p>
            This dictates that all particles in the universe fall into two categories:
          </p>
          <ul className="list-disc pl-6 space-y-4 my-6 marker:text-foreground/40 text-foreground/80">
            <li><strong>Fermions:</strong> Particles with half-integer spin (electrons, protons, quarks). They have antisymmetric wavefunctions, meaning they obey the Pauli Exclusion Principle. No two fermions can occupy the exact same quantum state.</li>
            <li><strong>Bosons:</strong> Particles with integer spin (photons, phonons, Helium-4 atoms). They have symmetric wavefunctions. They not only share states but actively "prefer" to bunch up into the same state.</li>
          </ul>
          
          <ImagePlaceholder 
            alt="Comparison of Maxwell-Boltzmann, Fermi-Dirac, and Bose-Einstein distribution functions" 
            caption="Fig 3: Average occupation number ⟨n⟩ vs Energy. Notice the Fermi step function at T=0, and the divergence of the Bose curve at low energies."
          />

          <p>
            Using the Grand Canonical ensemble, we can calculate the average number of particles <InlineMath math="\langle n_k \rangle" /> occupying a single-particle quantum state with energy <InlineMath math="\epsilon_k" />. The results differ by a single, universe-altering plus or minus sign:
          </p>
          <Eq math="\langle n_k \rangle_{\text{FD}} = \frac{1}{e^{\beta(\epsilon_k - \mu)} + 1} \quad \quad \langle n_k \rangle_{\text{BE}} = \frac{1}{e^{\beta(\epsilon_k - \mu)} - 1}" label="Quantum Occupation Numbers" />
        </Section>

        {/* 7. Degenerate Fermi Gas */}
        <Section title="7. The Degenerate Fermi Gas" delay={0.4}>
          <p>
            Consider a gas of electrons (fermions) at absolute zero (<InlineMath math="T=0" />). Classically, they should all drop to zero energy. Quantum mechanically, the Pauli Exclusion Principle forbids this. They must stack up, filling energy levels one by one up to a maximum energy known as the <Ref href="https://en.wikipedia.org/wiki/Fermi_energy">Fermi Energy</Ref> (<InlineMath math="E_F" />). 
          </p>
          <p>
            This "stacking" means that even at absolute zero, the electron gas possesses a massive amount of kinetic energy and exerts a tremendous pressure, known as <em>Degeneracy Pressure</em>.
          </p>
          <Eq math="E_F = \frac{\hbar^2}{2m} \left( 3\pi^2 \frac{N}{V} \right)^{2/3}" label="Fermi Energy" />
          <p>
            This exact mechanism is what stops White Dwarf stars and Neutron Stars from collapsing under their own immense gravity. It also explains why electrons in metals do not contribute to heat capacity at room temperature: only the tiny fraction of electrons right at the Fermi surface can actually absorb thermal energy.
          </p>
        </Section>

        {/* 8. Bose-Einstein Condensation */}
        <Section title="8. Bosons and Bose-Einstein Condensation" delay={0.45}>
          <p>
            Bosons behave entirely differently. Because they like to share states, as we cool a gas of bosons down, something spectacular happens. At a specific critical temperature <InlineMath math="T_c" />, the macroscopic occupation of the lowest available energy level (the ground state) begins.
          </p>
          
          <ImagePlaceholder 
            alt="Density profile of a Bose-Einstein Condensate forming as temperature drops below Tc" 
            caption="Fig 4: Velocity distribution of rubidium atoms. As the temperature drops below the critical threshold, a massive spike appears at zero velocity—a macroscopic quantum state."
          />

          <p>
            This is <Ref href="https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate">Bose-Einstein Condensation (BEC)</Ref>. Unlike freezing water, this phase transition is driven entirely by quantum statistics, not by interacting molecular forces. A macroscopic number of atoms coalesce into a single quantum wavefunction, allowing quantum mechanics to be observed on a macroscopic scale.
          </p>
          <Eq math="T_c = \frac{2\pi \hbar^2}{m k_B} \left( \frac{N}{V \zeta(3/2)} \right)^{2/3}" label="Critical Temperature for BEC" />
        </Section>

        {/* 9. Interacting Systems & Phase Transitions */}
        <Section title="9. Phase Transitions & The Ising Model" delay={0.5}>
          <p>
            Up to this point, we assumed non-interacting particles. But the most interesting physics—liquids, magnets, superconductors—arises from interactions. How does a ferromagnet suddenly lose its magnetism when heated past its Curie temperature? 
          </p>
          <p>
            The simplest framework for modeling this is the <strong>Ising Model</strong>. Imagine a lattice where at every site there is a spin <InlineMath math="\sigma_i \in \{+1, -1\}" />. Spins prefer to align with their neighbors to minimize energy, dictated by a coupling constant <InlineMath math="J" />. The Hamiltonian is:
          </p>
          <Eq math="\mathcal{H} = -J \sum_{\langle i,j \rangle} \sigma_i \sigma_j - h \sum_i \sigma_i" label="Ising Hamiltonian" />
          <p>
            At high temperatures, thermal fluctuations violently flip the spins. The average magnetization is zero (paramagnetism). At low temperatures, the <InlineMath math="J" /> coupling wins, and the spins spontaneously align, breaking the symmetry of the system (ferromagnetism). 
          </p>
          <p>
            To solve this, physicists use <em>Mean-Field Theory</em>, assuming each spin just feels an "average" magnetic field from its neighbors. This leads to a transcendental self-consistency equation for the average magnetization <InlineMath math="m" />:
          </p>
          <Eq math="m = \tanh\big(\beta (J z m + h)\big)" label="Mean-Field Magnetization" />
          
          <ImagePlaceholder 
            alt="Graph of spontaneous magnetization (m) vs Temperature (T) showing a continuous phase transition at Tc" 
            caption="Fig 5: Spontaneous symmetry breaking. As T drops below Tc, the magnetization bifurcates from zero, choosing either a positive or negative macroscopic alignment."
          />

          <p>
            Near the critical temperature <InlineMath math="T_c" />, the system exhibits massive fluctuations. The length scale of correlated spins diverges to infinity. Remarkably, the way these systems behave near criticality—defined by their <em>critical exponents</em>—is exactly identical across wildly different physical systems. A boiling fluid and a ferromagnet share the same mathematical exponents. This concept, known as <strong>Universality</strong>, led to the development of the Renormalization Group, one of the crowning theoretical achievements of the 20th century.
          </p>
        </Section>

      </article>
    </main>
  )
}