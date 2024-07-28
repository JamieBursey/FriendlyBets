import { supabase } from "../supabaseClient";

const acceptBets = async (betId, callback) => {
  try {
    // Update the bet status in the Supabase database
    const { data, error } = await supabase
      .from("bets")
      .update({ betstatus: "active" })
      .eq("betid", betId);

    if (error) {
      console.error("Error updating bet status:", error);
      alert("There was an error accepting the bet. Please try again.");
      return;
    }

    // Optionally, you can fetch the updated bet to verify the update
    const { data: updatedBet, error: fetchError } = await supabase
      .from("bets")
      .select("*")
      .eq("betid", betId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated bet:", fetchError);
      alert("There was an error fetching the updated bet. Please try again.");
      return;
    }

    // Log the updated bet data for debugging purposes
    console.log("Updated Bet:", updatedBet);

    // Call the callback function if provided
    if (callback) {
      callback();
    }

    alert("Bet accepted successfully!");
  } catch (error) {
    console.error("Unexpected error accepting bet:", error);
    alert("There was an unexpected error. Please try again.");
  }
};

// Existing function for deleting bets
const deleteBets = async (betId, callback) => {
  const { error } = await supabase.from("bets").delete().eq("betid", betId);

  if (error) {
    console.error("Error deleting bet:", error);
    alert("There was an error deleting the bet. Please try again.");
    return;
  }

  if (callback) {
    callback();
  }
};

export { acceptBets, deleteBets };
