window.submitEpisodeData = async function submitEpisodeData(episodeData) {
  try {
    console.log('Preparing to submit episode data:', episodeData);

    const mutation = `
      mutation CreateEpisode($input: EpisodeInput!) {
        createEpisode(input: $input) {
          id
          title
          episodeNumber
          youtubeLink
        }
      }
    `;

    const variables = {
      input: {
        title: episodeData.title,
        episodeNumber: episodeData.episodeNumber || null,
        youtubeLink: episodeData.youtubeLink || null,
      },
    };

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Episode created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in submitEpisodeData:', error);
    throw new Error(`Failed to submit episode: ${error.message}`);
  }
};