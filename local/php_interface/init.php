<?
require_once 'lib/debug.php';
require_once 'lib/user.php';
require_once 'lib/order.php';
require_once 'lib/stone.php';

define("CATALOG_ID", 18);
define("CATALOG_PRICE_ID", 1);
define("CATALOG_PRICE", "BASE");
define("CATALOG_DEALER_PRICE_ID", 4);
define("CATALOG_DEALER_PRICE", "OPT");
****
****


if (!function_exists('iconv_deep')) {
	function iconv_deep($e1, $e2, $value)
	{
		if (is_array($value))  {
			$item = null;
			foreach ($value as &$item) {
				$item = iconv_deep($e1, $e2, $item);
			}
			unset($item);
		} else {
			if (is_string($value)) $value = mb_convert_encoding($value, $e2, $e1);
		}
		return $value;
	}
}

function pmcache($func)
{
	$args = func_get_args();
	array_shift($args);

	if (strpos($func, '::') !== false) {
		$func = explode('::', $func);
	}

	$obCache = new CPHPCache;
	$CACHE_TIME = 360000000;
	$strCacheID = serialize($args);
	$sCustomCachePath = SITE_ID . '/' . __FUNCTION__ . '/' . implode('/', (array)$func);
	if ($obCache->StartDataCache($CACHE_TIME, $strCacheID, $sCustomCachePath)) {
		if ($CACHE_TIME && defined('BX_COMP_MANAGED_CACHE')) {
			$GLOBALS['CACHE_MANAGER']->StartTagCache($sCustomCachePath);
			$GLOBALS['CACHE_MANAGER']->RegisterTag(implode('/', (array)$func));
		}
		$array = call_user_func_array($func, $args);
		if ($CACHE_TIME && defined('BX_COMP_MANAGED_CACHE')) {
			$GLOBALS['CACHE_MANAGER']->EndTagCache();
		}

		if ($CACHE_TIME && defined('BX_COMP_MANAGED_CACHE')) {
			$GLOBALS['CACHE_MANAGER']->EndTagCache();
		}
		$obCache->EndDataCache($array);
	} else {
		$array = $obCache->GetVars();
	}

	return $array;
}

function getCatalogMinPrice($ib, $price, $scode = '')
{
	$arFilter = array(
		"IBLOCK_ID" => $ib,
		"ACTIVE" => "Y",
		">CATALOG_PRICE_$price" => "0",
		//"SECTION_ACTIVE" => "Y"
	);

	if (strlen($scode)) {
		$arFilter["SECTION_CODE"] = $scode;
	}

	$ar = CIBlockElement::GetList(
		array(
			"CATALOG_PRICE_$price" => "ASC"
		),
		$arFilter,
		false,
		array(
			"nTopCount" => 1
		),
		array(
			"ID",
			"CATALOG_PRICE_$price"
		)
	);
	if ($ar = $ar->Fetch()) {
		return floatval($ar["CATALOG_PRICE_$price"]);
	}

	return 0;
}

function getCatalogMaxPrice($ib, $price, $scode = '')
{
	$arFilter = array(
		"IBLOCK_ID" => $ib,
		"ACTIVE" => "Y",
		">CATALOG_PRICE_$price" => "0",
		//"SECTION_ACTIVE" => "Y",
	);

	if (strlen($scode)) {
		$arFilter["SECTION_CODE"] = $scode;
	}

	$ar = CIBlockElement::GetList(
		array(
			"CATALOG_PRICE_$price" => "DESC"
		),
		$arFilter,
		false,
		array(
			"nTopCount" => 1
		),
		array(
			"ID",
			"CATALOG_PRICE_$price"
		)
	);
	if ($ar = $ar->Fetch()) {
		return floatval($ar["CATALOG_PRICE_$price"]);
	}

	return 0;
}