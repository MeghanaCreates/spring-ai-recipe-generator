// src/App.js
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./App.css";
import CuisineSelector from "./CuisineSelector";

// images (make sure files exist in src/assets/)

import pageBg from "./assets/MultiCuisine.jpg";
import recipeBg from "./assets/RecipePage.png";

const BACKEND_BASE = process.env.REACT_APP_API_URL;
const RECIPE_URL = `${BACKEND_BASE}/recipe-creater`;

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const ingredientInputRef = useRef(null);
  const [dietPreset, setDietPreset] = useState("");
  const [dietCustom, setDietCustom] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipeText, setRecipeText] = useState("");
  const [showRecipeFull, setShowRecipeFull] = useState(false);

  const initialCuisineButtons = ["Italian", "Indian", "Mexican", "Chinese"];
  const dietOptions = ["", "Vegetarian", "Non-Vegetarian", "Vegan"];

  const addIngredientFromInput = () => {
    const raw = ingredientInput.trim();
    if (!raw) return;
    const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setIngredients((prev) => [...prev, ...parts]);
    setIngredientInput("");
    ingredientInputRef.current && ingredientInputRef.current.focus();
  };

  const handleIngredientKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredientFromInput();
    }
  };

  const removeIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const pickCuisineThenNext = (c) => {
    setSelectedCuisine(c);
    setStep(2);
  };

  const goBackToCuisine = () => {
    setStep(1);
  };

    const callBackendForRecipe = async () => {
    setLoadingRecipe(true);
    setRecipeText("");
    try {
      const params = new URLSearchParams({
        ingredients: ingredients.join(","),
        cuisine: selectedCuisine || "",
        dieteryRestrictions: dietCustom || dietPreset || ""
      });

      const url = `${RECIPE_URL}?${params.toString()}`;
      // debug log so you can inspect the response in browser console
      console.debug("[callBackendForRecipe] url:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "text/plain" }
      });

      console.debug("[callBackendForRecipe] status:", res.status, "ct:", res.headers.get("content-type"));

      // read as text (your backend returns plain text)
      const text = await res.text();
console.log("[DEBUG] recipe response length:", text ? text.length : 0);
setRecipeText(text || "No recipe returned.");
setShowRecipeFull(true);
console.log("[DEBUG] setShowRecipeFull called — UI should display overlay now.");

      // scroll to top to ensure overlay is visible
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[callBackendForRecipe] error:", err);
      setRecipeText("Error: " + (err.message || String(err)));
      setShowRecipeFull(true);
    } finally {
      setLoadingRecipe(false);
    }
  };


  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }
    callBackendForRecipe();
  };

  // Inline style to set correct imported background image (webpack resolved)
  const bgStyle = { backgroundImage: `url(${pageBg})` };

  return (
    <>
      <div className="bg-cover rich-bg" style={bgStyle} aria-hidden="true"></div>

      <div className="container">
        <main className="hero" role="main" aria-labelledby="page-title">
          <div className="hero-left">
            <div className="brand with-side-image">
              <div className="title-block">
                <h1 id="page-title" className="title">Kitchen In ur hands</h1>
                <p className="subtitle">Turn your pantry into delicious meals — choose a cuisine to start.</p>
              </div>

              
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="helper">Quick try cuisines</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {initialCuisineButtons.map((c) => (
  <button
    key={c}
    className={`btn-ghost cuisine-quick ${selectedCuisine === c ? "selected" : ""}`}
    onClick={() => pickCuisineThenNext(c)}
  >
    {c}
  </button>
))}

              </div>
            </div>
          </div>

          <div className="hero-right">
            {step === 1 && (
              <div className="panel">
                <h3 className="panel-title">Pick a cuisine</h3>
                <p className="helper">Either pick one of the quick buttons or use the continent selector below.</p>

                <div style={{ marginTop: 14 }}>
                  <label className="label">Full cuisines list (continent-wise)</label>

                  {/* CuisineSelector shows continent dropdown + helper text + searchable list */}
                  <CuisineSelector
                    initialCuisine={selectedCuisine}
                    onSelect={(cuisine, continent) => {
                      setSelectedCuisine(cuisine);
                      setStep(2);
                    }}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="panel">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
  <h3 className="panel-title" style={{ marginRight: 12 }}>Ingredients and Dietary Restrictions</h3>
  {/* Use same visual style as Add/Get Recipe button by using className "cta" */}
  <button className="cta" onClick={goBackToCuisine} style={{ whiteSpace: "nowrap" }}>
    Change cuisine
  </button>
</div>


                <div style={{ marginTop: 10 }}>
                  <div className="label">Selected cuisine</div>
                  <div className="helper" style={{ marginTop: 6 }}>
                    <strong>{selectedCuisine || "Not selected"}</strong>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label className="label">Ingredients (add unlimited)</label>
                  <div className="ingredient-row">
                    <input
                      ref={ingredientInputRef}
                      type="text"
                      placeholder="Type ingredient and press Enter or comma, or click Add"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyDown={handleIngredientKey}
                    />
                    <button type="button" className="cta" onClick={addIngredientFromInput}>Add</button>
                  </div>

                  <div className="chips" style={{ marginTop: 10 }}>
                    {ingredients.length === 0 && <div className="helper">No ingredients added yet.</div>}
                    {ingredients.map((ing, idx) => (
                      <div className="chip" key={idx}>
                        <span>{ing}</span>
                        <button className="chip-remove" onClick={() => removeIngredient(idx)} aria-label={`Remove ${ing}`}>&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label className="label">Dietary restrictions</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
  value={dietPreset}
  onChange={(e) => setDietPreset(e.target.value)}
  style={{ color: "#111", background: "#fff" }}
>
  <option value="">Select (optional)</option>
  {dietOptions.map((d) => <option key={d} value={d}>{d || "None"}</option>)}
</select>


                    <input
                      type="text"
                      placeholder="Or type custom dietary restriction"
                      value={dietCustom}
                      onChange={(e) => setDietCustom(e.target.value)}
                    />
                  </div>
                  <div className="helper" style={{ marginTop: 6 }}>
                    Choose from the list or type your own. Custom text overrides preset.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
                  <button className="btn-ghost" onClick={() => { setIngredients([]); setDietCustom(""); setDietPreset(""); }}>Reset</button>
                  <button className="cta" onClick={handleSubmit} disabled={loadingRecipe}>{loadingRecipe ? "Generating…" : "Get Recipe"}</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showRecipeFull && createPortal(
  <div className="recipe-fullscreen" role="dialog" aria-modal="true" aria-label="Recipe result">
    <div
      className="recipe-inner"
      style={{
        backgroundImage: recipeBg ? `url(${recipeBg})` : undefined,
        backgroundColor: "rgba(0,0,0,0.65)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <button className="close-recipe" onClick={() => setShowRecipeFull(false)} aria-label="Close recipe">✕</button>
      <div className="recipe-content">
        <h2 className="recipe-title">Your Generated Recipe</h2>
        <pre className="recipe-text">{recipeText}</pre>
      </div>
    </div>
  </div>,
  document.body
)}

    </>
  );
}
