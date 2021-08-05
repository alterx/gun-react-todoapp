// key<sha1({Company:'mycompany123',companyid:321,Name:'My Company'})> or "da39a3ee5e6b4b0d3255bfef95601890afd80709" substringed to  da39a3ee5e -> value<Gun refpointer>

// try await SEA.work("hey", "ho", null,{name:'SHA-1',encode:'hex'})

/// or 'SHA-256'
export const getHash = async (
  data,
  sea,
  max = 12,
  name = 'SHA-1',
  salt = null
) => {
  const message = await sea.work(data, salt, null, {
    name,
    encode: 'hex',
  });
  return message.slice(0, max);
};
