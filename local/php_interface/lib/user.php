<?
class CCustomUser
{
	public static function IsDealer()
	{
		return in_array(9, $GLOBALS["USER"]->GetUserGroupArray());
	}

	public static function IsOnline()
	{
		return $GLOBALS["USER"]->IsAuthorized();
	}
}