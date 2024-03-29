/*
     File:       HIDisclosureViews.r
 
     Contains:   API and type definitions related to disclosure views.
 
     Version:    HIToolbox-343~1
 
     Copyright:  � 1999-2006 by Apple Computer, Inc., all rights reserved.
 
     Bugs?:      For bug reports, consult the following page on
                 the World Wide Web:
 
                     http://developer.apple.com/bugreporter/
 
*/

#ifndef __HIDISCLOSUREVIEWS_R__
#define __HIDISCLOSUREVIEWS_R__

#ifndef __CORESERVICES_R__
#include <CoreServices/CoreServices.r>
#endif

#define kControlKindDisclosureButton 	'disb'
#define kControlDisclosureButtonClosed 	0
#define kControlDisclosureButtonDisclosed  1

#define kControlTriangleProc 			64
#define kControlTriangleLeftFacingProc 	65
#define kControlTriangleAutoToggleProc 	66
#define kControlTriangleLeftFacingAutoToggleProc  67

#define kControlKindDisclosureTriangle 	'dist'
#define kControlTriangleLastValueTag 	'last'

#endif /* __HIDISCLOSUREVIEWS_R__ */

