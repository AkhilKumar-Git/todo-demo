import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AddTodo() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Task cannot be empty.");
      return;
    }

    try {
      // Reset any previous error
      setError(null);

      // Insert the new todo into the Supabase "todos" table
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title: trimmedText }]);

      if (error) {
        setError(`Error adding todo: ${error.message}`);
      } else {
        console.log("Todo added successfully:", data);
        setText(""); // Clear the input after successful addition
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-grow"
      />
      <Button type="submit" className="self-start">
        Add todo
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}