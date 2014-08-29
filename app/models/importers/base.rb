require 'deep_merge/rails_compat'

module Importers
  # Takes a 2D list of rows with header and converts it to a hash for each
  # non-header row
  def self.flat_to_nested(rows)
    header = rows.shift
    header_split = split_flat_header_into_parts(header)

    rows.map do |r|
      # Merges those hashes with index and value keys into final hashes
      # Only handles one level of arrays
      merge_arrays_of_hashes = lambda do |h|
        puts "h: #{h}"
        h.inject({}) do |acc, (k, v)|
          array_merged = {k => case v
            when Array
              v.inject([]) do |acc2, h|
                index = h[:index]
                value = h[:value]
                acc2[index] ||= {}
                acc2[index].deep_merge!(value)
                acc2
              end
            else
              v
            end}
          acc.deep_merge(array_merged)
        end
      end

      merge_arrays_of_hashes.call(header_split.each_with_index.inject({}) do |acc, (header, i)|
        # THIS ASSUMES ANY HEADER INDECES ARE ALREADY ORDERED ASCENDING
        if r[i].nil?
          acc
        else
          acc.deeper_merge(header[0..-2].reverse.inject({header.last => r[i]}) do |acc4, part|
            match = part.match /\[(\d+)\]/
            if match
              # Subtract 1 since we make the exports use 1-based indeces
              index = match.captures[0].to_i - 1
              {part.sub(match[0], '') => [{:index => index, :value => acc4}]}
            else
              {part => acc4}
            end
          end)
        end
      end)
    end
  end

  # Converts a flat header key into it's constituent parts
  # E.g. 'family_details[1]name' --> ['family_details[1]', 'name']
  def self.split_flat_header_into_parts(header)
    header.map do |n|
      n.split(/(?<=\])/).map {|p| p.sub(/^_/, '') }
    end
  end
end
