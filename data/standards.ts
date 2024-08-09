const standards: {
  id: string;
  description: string;
}[] = [
  {
    id: "2.MD.C.8",
    description:
      "Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols appropriately. Example: If you have 2 dimes and 3 pennies, how many cents do you have?",
  },
  {
    id: "2.NBT.B.5",
    description:
      "Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.",
  },
  {
    id: "2.OA.A.1",
    description:
      "Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.",
  },
  {
    id: "3.OA.D.8",
    description:
      "Solve two-step word problems using the four operations. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.",
  },
  {
    id: "4.NF.C.7",
    description:
      "Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual model.",
  },
  {
    id: "4.OA.A.1",
    description:
      "Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.",
  },
  {
    id: "4.OA.A.2",
    description:
      "Multiply or divide to solve word problems involving multiplicative comparison, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison.",
  },
  {
    id: "4.OA.A.3",
    description:
      "Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.",
  },
  {
    id: "5.NBT.A.4",
    description:
      "Use place value understanding to round decimals to any place.",
  },
  {
    id: "5.NBT.B.7",
    description:
      "Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.",
  },
  {
    id: "6.EE.B.7",
    description:
      "Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.",
  },
  {
    id: "6.EE.C.9",
    description:
      "Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation. For example, in a problem involving motion at constant speed, list and graph ordered pairs of distances and times, and write the equation d = 65t to represent the relationship between distance and time.",
  },
  {
    id: "7.EE.A.2",
    description:
      'Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related. For example, a + 0.05a = 1.05a means that “increase by 5%” is the same as “multiply by 1.05".',
  },
  {
    id: "7.EE.B.4",
    description:
      "Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.",
  },
  {
    id: "7.RP.A.1",
    description:
      "Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units. For example, if a person walks 1/2 mile in each 1/4 hour, compute the unit rate as the complex fraction 1/2/1/4 miles per hour, equivalently 2 miles per hour.",
  },
  {
    id: "7.RP.A.3",
    description:
      "Use proportional relationships to solve multistep ratio and percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.",
  },
];

export function getStandard(id: string): string {
  const ccssMap = new Map();
  for (const standard of standards) {
    ccssMap.set(standard.id, standard.description);
  }

  return ccssMap.get(id) || "Standard not found";
}
