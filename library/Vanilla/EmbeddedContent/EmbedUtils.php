<?php
/**
 * @author Adam Charron <adam.c@vanillaforums.com>
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

namespace Vanilla\EmbeddedContent;

use Garden\Http\HttpResponse;

/**
 * Simple static embed utilities.
 */
class EmbedUtils {

    /**
     * Attempt to extract some height/width values from an oembed repsonse.
     * Falls back to 16/9 ratio if no values could be found.
     *
     * @param array|\ArrayAccess $response The response data to check.
     *
     * @return array A tuple of [$height, $width].
     */
    public static function extractDimensions($response): array {
        // Parse the ID out of the URL.
        $width = $response['width'] ?? null;
        $height = $response['height'] ?? null;

        // If we don't have our width/height ratio, fall back to a 16/9 ratio.
        if ($width === null || $response === null) {
            $width = 16;
            $height = 9;
        }

        return [$height, $width];
    }

    /**
     * Enforce standardized width/height.
     *
     * @param array $data The data to check.
     * @return array The normalized data.
     */
    public static function ensureDimensions(array $data): array {
        [$height, $width] = self::extractDimensions($data);
        $data['height'] = $height;
        $data['width'] = $width;
        return $data;
    }

    /**
     * Remap one data key into another if it doesn't exist.
     *
     * @param array $data The data to modify.
     * @param array $modifications The mapping of 'newName' => 'oldName'.
     * @return array
     */
    public static function remapProperties(array $data, array $modifications): array {
        foreach ($modifications as $key => $value) {
            if (isset($data[$key])) {
                continue;
            }

            $oldValue = valr($value, $data);
            setvalr($key, $data, $oldValue);
        }
        return $data;
    }
}
